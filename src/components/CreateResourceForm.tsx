import React, { useState } from 'react';
import { useCreateResource } from '../hooks/ckan/resources/useCreateResource';
import type { Resource } from 'ckan-ts';

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
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState('');

  const { createResourceAsync, isPending, isError, error, isSuccess } =
    useCreateResource();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
          placeholder="Enter resource name"
          required
        />
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
          className="border border-gray-300 rounded-lg p-2"
          placeholder="Enter resource URL"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
          placeholder="Enter resource description"
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="format" className="text-sm font-medium">
          Format
        </label>
        <input
          type="text"
          id="format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
          placeholder="Enter resource format (e.g., CSV, JSON)"
        />
      </div>

      {isError && (
        <div className="text-red-500 text-sm">
          Error:{' '}
          {error instanceof Error ? error.message : 'Failed to create resource'}
        </div>
      )}

      {isSuccess && (
        <div className="text-green-500 text-sm">
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
