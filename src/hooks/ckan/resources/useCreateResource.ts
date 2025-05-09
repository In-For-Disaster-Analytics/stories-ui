import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Resource } from '../../../types/resource';

interface CreateResourceParams {
  package_id: string;
  name: string;
  url: string;
  description?: string;
  format?: string;
  hash?: string;
  size?: number;
  [key: string]: string | number | undefined;
}

export const useCreateResource = () => {
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
        const result = await fetch(
          `${import.meta.env.VITE_CKAN_URL}/api/3/action/resource_create`,
          {
            method: 'POST',
            body: JSON.stringify(params),
          },
        );
        return (await result.json()) as Resource;
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
