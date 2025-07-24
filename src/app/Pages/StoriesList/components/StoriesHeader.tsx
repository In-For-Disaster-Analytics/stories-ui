import React from 'react';

interface StoriesHeaderProps {
  onRefresh: () => void;
}

const StoriesHeader: React.FC<StoriesHeaderProps> = ({ onRefresh }) => {
  return (
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
              onClick={onRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesHeader;