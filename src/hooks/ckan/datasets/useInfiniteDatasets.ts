import { useInfiniteQuery } from '@tanstack/react-query';
import { Dataset } from '../../../types/Dataset';
import { DatasetSearchOptions } from '../../../types/types';
import useAccessToken from '../../auth/useAccessToken';

interface InfiniteDatasetPage {
  datasets: Dataset[];
  nextOffset?: number;
  totalCount: number;
}

export const useInfiniteDatasets = (options?: Omit<DatasetSearchOptions, 'offset'>) => {
  const { accessToken } = useAccessToken();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['datasets-infinite', options],
    queryFn: async ({ pageParam = 0 }): Promise<InfiniteDatasetPage> => {
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
        if (options?.limit) {
          queryParams.append('rows', options.limit.toString());
        }
        queryParams.append('start', pageParam.toString());
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
        const datasets = response.result.results;
        const totalCount = response.result.count;
        const limit = options?.limit || 20;
        const nextOffset = pageParam + limit < totalCount ? pageParam + limit : undefined;

        return {
          datasets,
          nextOffset,
          totalCount,
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to fetch datasets: ${errorMessage}`);
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
  });

  // Flatten all datasets from all pages
  const allDatasets = data?.pages.flatMap((page) => page.datasets) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  return {
    datasets: allDatasets,
    totalCount,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
};