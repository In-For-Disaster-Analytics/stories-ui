import React from 'react';
import { FiEye, FiPlus } from 'react-icons/fi';
import { useStory } from '../StoryContext';
import { Link, useParams } from 'react-router-dom';

const Header: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    handleAddResource,
    datasetTitle,
    datasetDescription,
    setDatasetTitle,
    setDatasetDescription,
  } = useStory();

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-1">Story Editor</h1>
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={datasetTitle}
            onChange={(e) => setDatasetTitle(e.target.value)}
            placeholder="Dataset title"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
          />
          <textarea
            value={datasetDescription}
            onChange={(e) => setDatasetDescription(e.target.value)}
            placeholder="Dataset description"
            rows={2}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600 resize-y"
          />
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
