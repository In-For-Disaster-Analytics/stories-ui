import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Resource } from '../../../types/resource';
import useAccessToken from '../../auth/useAccessToken';
import GenericResponse from '../../../types/GenericResponse';

export interface UpdateResourceParams {
  id: string; // Required: Resource ID to update
  name?: string;
  description?: string;
  format?: string;
  file?: File; // For uploading new file content
  url?: string; // For URL-based resources
  [key: string]: string | number | File | undefined;
}

export const useUpdateResource = () => {
  const { accessToken } = useAccessToken();

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    data,
    error,
    reset,
  } = useMutation({
    mutationFn: async (params: UpdateResourceParams): Promise<Resource> => {
      try {
        const { id, file, ...metadata } = params;

        if (!id) {
          throw new Error('Resource ID is required for updates');
        }

        let body: FormData | string;
        const headers: HeadersInit = {};

        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        // Use FormData for file uploads, JSON for metadata-only updates
        if (file) {
          const formData = new FormData();
          formData.append('id', id);
          formData.append('upload', file);

          // Add all metadata fields to FormData
          Object.entries(metadata).forEach(([key, value]) => {
            if (value !== undefined) {
              formData.append(key, String(value));
            }
          });

          body = formData;
          // Don't set Content-Type header for FormData - browser will set it with boundary
        } else {
          // JSON request for metadata-only updates
          headers['Content-Type'] = 'application/json';
          body = JSON.stringify({ id, ...metadata });
        }

        const result = await fetch(
          `${import.meta.env.VITE_CKAN_BASE_URL}/api/3/action/resource_update`,
          {
            method: 'POST',
            headers,
            body,
          },
        );

        if (!result.ok) {
          const errorData = await result.json();
          throw new Error(
            errorData.error?.message ||
              `Failed to update resource (${result.status})`,
          );
        }

        const response = (await result.json()) as GenericResponse<Resource>;
        if (!response.success || !response.result) {
          throw new Error(
            response.error?.message || 'Failed to update resource',
          );
        }

        return response.result;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to update resource: ${errorMessage}`);
      }
    },
  });

  // Reset mutation state when component unmounts
  useEffect(() => reset(), [reset]);

  return {
    isPending,
    isError,
    isSuccess,
    data,
    error,
    reset,
    updateResource: (params: UpdateResourceParams) => {
      return mutate(params);
    },
    updateResourceAsync: (params: UpdateResourceParams) => {
      return mutateAsync(params);
    },
  };
};
