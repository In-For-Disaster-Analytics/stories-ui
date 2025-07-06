import React, { useState } from 'react';
import { FiEye, FiPlus } from 'react-icons/fi';
import { useStory } from '../StoryContext';
import { Link, useParams } from 'react-router-dom';

const Header: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { handleAddResource, datasetTitle, datasetDescription } = useStory();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldShowLoadMore = datasetDescription && datasetDescription.length > 200;
  const displayDescription = shouldShowLoadMore && !isExpanded 
    ? datasetDescription.substring(0, 200) + '...'
    : datasetDescription;

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-1">{datasetTitle}</h1>
        <div className="mb-4 space-y-2">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {displayDescription}
            {shouldShowLoadMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {isExpanded ? 'Show less' : 'Load more'}
              </button>
            )}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex bg-gray-100 rounded-full p-1"></div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700"
              onClick={handleAddResource}
            >
              <FiPlus className="w-4 h-4" />
              Add Resource
            </button>
            {/*Go to resources*/}
            <Link
              to={`/stories/${id}/resources`}
              className="flex items-center gap-2 bg-white text-blue-600 border border-blue-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-50"
            >
              <FiEye className="w-4 h-4" />
              View Resources
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
