import { useQuery } from '@tanstack/react-query';
import { RawDataset } from '../../../types/Dataset';
import useAccessToken from '../../auth/useAccessToken';

export const useDetailDataset = (datasetId: string) => {
  const { accessToken } = useAccessToken();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dataset', datasetId],
    queryFn: async (): Promise<RawDataset> => {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const result = await fetch(
          `${import.meta.env.VITE_CKAN_BASE_URL}/api/3/action/package_show?id=${datasetId}`,
          {
            method: 'GET',
            headers,
          },
        );

        if (!result.ok) {
          const errorData = await result.json();
          throw new Error(
            errorData.error?.message || 'Failed to fetch dataset details',
          );
        }

        const response = await result.json();
        return response.result as RawDataset;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to fetch dataset details: ${errorMessage}`);
      }
    },
    enabled: !!datasetId, // Only run the query if we have a datasetId
  });

  return {
    dataset: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
