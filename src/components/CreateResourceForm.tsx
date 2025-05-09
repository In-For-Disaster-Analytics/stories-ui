import React, { useState, useEffect } from 'react';
import { useCreateResource } from '../hooks/ckan/resources/useCreateResource';
import type { Resource } from '../types/resource';
import { useAuth } from '../contexts/AuthContext';
import { FiUpload } from 'react-icons/fi';
import type { CreateResourceParams } from '../hooks/ckan/resources/useCreateResource';

interface CreateResourceFormProps {
  packageId: string;
  onSuccess?: (resource: Resource) => void;
  onError?: (error: Error) => void;
}

export const CreateResourceForm: React.FC<CreateResourceFormProps> = ({
  packageId,
  onSuccess,
  onError,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isAuthenticated } = useAuth();

  const { createResourceAsync, isPending, isError, error, isSuccess } =
    useCreateResource();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (files.length === 0) {
      newErrors.files = 'At least one file is required';
    }

    if (description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const params: CreateResourceParams = {
        package_id: packageId,
        name,
        description,
      };

      if (files.length > 0) {
        params.files = files;
      }

      const result = await createResourceAsync(params);

      if (onSuccess) {
        onSuccess(result);
      }

      // Clear form after successful submission
      setName('');
      setDescription('');
      setFiles([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(newFiles)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

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
        <label
          htmlFor="files"
          className="flex flex-col items-center rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6"
        >
          <FiUpload className="size-6" />
          <span className="mt-4 font-medium">Upload your file(s)</span>
          <span className="mt-2 inline-block rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-center text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100">
            Browse files
          </span>
          <input
            multiple
            type="file"
            id="files"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
        {errors.files && (
          <span className="text-red-500 text-sm">{errors.files}</span>
        )}
        {files.length > 0 && (
          <div className="mt-2 space-y-2">
            <div className="text-sm text-gray-600">
              {files.length} file(s) selected
            </div>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span className="text-sm text-gray-700 truncate">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
