import React, { useState, useEffect } from 'react';
import { useInfiniteDatasets } from '../../../hooks/ckan/datasets/useInfiniteDatasets';
import { DatasetSearchOptions } from '../../../types/types';
import StoriesHeader from './components/StoriesHeader';
import SearchBar from './components/SearchBar';
import StoriesGrid from './components/StoriesGrid';

interface StoriesListProps {
  initialOptions?: DatasetSearchOptions;
}

const StoriesList: React.FC<StoriesListProps> = ({ initialOptions }) => {
  const [searchOptions, setSearchOptions] = useState<
    Omit<DatasetSearchOptions, 'offset'>
  >(initialOptions || { limit: 20 });
  const [searchQuery, setSearchQuery] = useState('');

  const {
    datasets,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteDatasets(searchOptions);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchOptions((prev) => ({
        ...prev,
        filterQuery: searchQuery,
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading && datasets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Stories
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || 'An error occurred while loading stories'}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <StoriesHeader onRefresh={() => refetch()} />
      
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <StoriesGrid
          datasets={datasets}
          searchQuery={searchQuery}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default StoriesList;
