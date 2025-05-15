import { useQuery } from '@tanstack/react-query';
import { Dataset } from '../../../types/Dataset';
import { DatasetSearchOptions } from '../../../types/types';
import useAccessToken from '../../auth/useAccessToken';

export const useListDatasets = (options?: DatasetSearchOptions) => {
  const { accessToken } = useAccessToken();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['datasets', options],
    queryFn: async (): Promise<Dataset[]> => {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (options?.filterQuery) {
          if (Array.isArray(options.filterQuery)) {
            options.filterQuery.forEach((query: string) =>
              queryParams.append('q', query),
            );
          } else {
            queryParams.append('q', options.filterQuery);
          }
        }
        if (options?.limit)
          queryParams.append('limit', options.limit.toString());
        if (options?.offset)
          queryParams.append('offset', options.offset.toString());
        if (options?.sort) {
          if (typeof options.sort === 'string') {
            queryParams.append('sort', options.sort);
          } else if (Array.isArray(options.sort)) {
            options.sort.forEach((sort) => {
              queryParams.append('sort', `${sort.by} ${sort.order || 'asc'}`);
            });
          } else {
            queryParams.append(
              'sort',
              `${options.sort.by} ${options.sort.order || 'asc'}`,
            );
          }
        }

        const result = await fetch(
          `${import.meta.env.VITE_CKAN_BASE_URL}/api/3/action/package_search?${queryParams.toString()}`,
          {
            method: 'GET',
            headers,
          },
        );

        if (!result.ok) {
          const errorData = await result.json();
          throw new Error(
            errorData.error?.message || 'Failed to fetch datasets',
          );
        }

        const response = await result.json();
        return response.result.results;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to fetch datasets: ${errorMessage}`);
      }
    },
  });

  return {
    datasets: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
