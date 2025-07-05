import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { RawDataset } from '../../../types/Dataset';
import useAccessToken from '../../auth/useAccessToken';
import GenericResponse from '../../../types/GenericResponse';

export interface UpdateDatasetParams {
  id: string; // Required: Dataset ID to update
  title?: string;
  notes?: string; // CKAN uses 'notes' for description
  name?: string;
  author?: string;
  author_email?: string;
  maintainer?: string;
  maintainer_email?: string;
  version?: string;
  [key: string]: string | undefined;
}

export const useUpdateDataset = () => {
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
    mutationFn: async (params: UpdateDatasetParams): Promise<RawDataset> => {
      try {
        const { id, ...metadata } = params;

        if (!id) {
          throw new Error('Dataset ID is required for updates');
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // JSON request for dataset metadata updates
        const body = JSON.stringify({ id, ...metadata });

        const result = await fetch(
          `${import.meta.env.VITE_CKAN_BASE_URL}/api/3/action/package_update`,
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
            `Failed to update dataset (${result.status})`,
          );
        }

        const response = (await result.json()) as GenericResponse<RawDataset>;
        if (!response.success || !response.result) {
          throw new Error(
            response.error?.message || 'Failed to update dataset',
          );
        }

        return response.result;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to update dataset: ${errorMessage}`);
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
    updateDataset: (params: UpdateDatasetParams) => {
      return mutate(params);
    },
    updateDatasetAsync: (params: UpdateDatasetParams) => {
      return mutateAsync(params);
    },
  };
};