import React from 'react';
import { Link } from 'react-router-dom';
import { Dataset } from '../../../../types/types';

interface StoriesGridProps {
  datasets: Dataset[];
  searchQuery: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const StoriesGrid: React.FC<StoriesGridProps> = ({
  datasets,
  searchQuery,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}) => {
  if (datasets && datasets.length > 0) {
    return (
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
            onClick={onLoadMore}
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
    );
  }

  return (
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
  );
};

export default StoriesGrid;