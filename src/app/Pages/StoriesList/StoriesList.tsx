import React, { useState } from 'react';
import { useInfiniteDatasets } from '../../../hooks/ckan/datasets/useInfiniteDatasets';
import { DatasetSearchOptions } from '../../../types/types';
import { Link } from 'react-router-dom';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOptions((prev) => ({
      ...prev,
      filterQuery: searchQuery,
    }));
  };

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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Stories</h1>
              <p className="mt-2 text-gray-600">
                Discover and explore datasets as stories
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => refetch()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {datasets && datasets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {story.title}
                    </h3>
                    {story.notes && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {story.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {story.tags &&
                        story.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {tag.displayName || tag.name}
                          </span>
                        ))}
                      {story.tags && story.tags.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          +{story.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{story.resources.length} resources</span>
                      {story.metadata?.created && (
                        <span>
                          {new Date(
                            story.metadata.created,
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <Link
                      to={`/stories/${story.id}`}
                      className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                      View Story →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage || !hasNextPage}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetchingNextPage
                  ? 'Loading...'
                  : hasNextPage
                    ? 'Load More Stories'
                    : 'No More Stories'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No stories found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? `No stories match your search for "${searchQuery}"`
                : 'No stories are available at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesList;
