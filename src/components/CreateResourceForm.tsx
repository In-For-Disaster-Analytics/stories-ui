import React, { useState, useEffect } from 'react';
import { useCreateResource } from '../hooks/ckan/resources/useCreateResource';
import type { Resource } from '../types/resource';
import { useAuth } from '../contexts/AuthContext';

interface CreateResourceFormProps {
  packageId: string;
  onSuccess?: (resource: Resource) => void;
  onError?: (error: Error) => void;
}

const COMMON_FORMATS = ['CSV', 'JSON', 'XML', 'PDF', 'XLSX', 'ZIP'];

export const CreateResourceForm: React.FC<CreateResourceFormProps> = ({
  packageId,
  onSuccess,
  onError,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isAuthenticated } = useAuth();

  const { createResourceAsync, isPending, isError, error, isSuccess } =
    useCreateResource();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    if (description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (format && !COMMON_FORMATS.includes(format.toUpperCase())) {
      newErrors.format = 'Please select a valid format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrors({ auth: 'You must be logged in to create a resource' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const result = await createResourceAsync({
        package_id: packageId,
        name,
        url,
        description,
        format,
      });

      if (onSuccess) {
        onSuccess(result);
      }

      // Clear form after successful submission
      setName('');
      setUrl('');
      setDescription('');
      setFormat('');
      setErrors({});
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        // Reset success state
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.auth && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {errors.auth}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`border rounded-lg p-2 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter resource name"
          required
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="url" className="text-sm font-medium">
          URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`border rounded-lg p-2 ${
            errors.url ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter resource URL"
          required
        />
        {errors.url && (
          <span className="text-red-500 text-sm">{errors.url}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`border rounded-lg p-2 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter resource description"
          rows={3}
        />
        {errors.description && (
          <span className="text-red-500 text-sm">{errors.description}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="format" className="text-sm font-medium">
          Format
        </label>
        <select
          id="format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className={`border rounded-lg p-2 ${
            errors.format ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a format</option>
          {COMMON_FORMATS.map((fmt) => (
            <option key={fmt} value={fmt}>
              {fmt}
            </option>
          ))}
        </select>
        {errors.format && (
          <span className="text-red-500 text-sm">{errors.format}</span>
        )}
      </div>

      {isError && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          Error:{' '}
          {error instanceof Error ? error.message : 'Failed to create resource'}
        </div>
      )}

      {isSuccess && (
        <div className="text-green-500 text-sm bg-green-50 p-2 rounded">
          Resource created successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={`w-full bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors ${
          isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
        }`}
      >
        {isPending ? 'Creating...' : 'Create Resource'}
      </button>
    </form>
  );
};
