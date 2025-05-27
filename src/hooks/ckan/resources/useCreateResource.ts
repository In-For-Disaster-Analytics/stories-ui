import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Resource } from '../../../types/resource';
import useAccessToken from '../../auth/useAccessToken';
import GenericResponse from '../../../types/GenericResponse';

export interface CreateResourceParams {
  package_id: string;
  name: string;
  url?: string;
  description?: string;
  format?: string;
  hash?: string;
  size?: number;
  file?: File;
  [key: string]: string | number | File | File[] | undefined;
}

export const useCreateResource = () => {
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
    mutationFn: async (params: CreateResourceParams): Promise<Resource> => {
      try {
        const formData = new FormData();

        // Add basic resource metadata
        formData.append('package_id', params.package_id);
        formData.append('name', params.name);

        if (params.description) {
          formData.append('description', params.description);
        }
        if (params.format) {
          formData.append('format', params.format);
        }
        if (params.url) {
          formData.append('url', params.url);
        }

        // Handle file uploads
        if (params.file) {
          formData.append('upload', params.file);
        }

        const headers: HeadersInit = {};
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const result = await fetch(
          `${import.meta.env.VITE_CKAN_BASE_URL}/api/3/action/resource_create`,
          {
            method: 'POST',
            headers,
            body: formData,
          },
        );

        if (!result.ok) {
          const errorData = await result.json();
          throw new Error(
            errorData.error?.message || 'Failed to create resource',
          );
        }

        const response = (await result.json()) as GenericResponse<Resource>;
        if (!response.success || !response.result) {
          throw new Error(
            response.error?.message || 'Failed to create resource',
          );
        }

        return response.result;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to create resource: ${errorMessage}`);
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
    createResource: (params: CreateResourceParams) => {
      return mutate(params);
    },
    createResourceAsync: (params: CreateResourceParams) => {
      return mutateAsync(params);
    },
  };
};
