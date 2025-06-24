import React from 'react';
import { FiEye, FiPlus } from 'react-icons/fi';
import { useStory } from '../StoryContext';
import { Link, useParams } from 'react-router-dom';

const Header: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { title, handleAddResource, handleViewPublished } = useStory();

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-1">Story Editor</h1>
        <p className="text-sm text-gray-600 mb-4">{title}</p>
        <div className="flex justify-between items-center">
          <div className="flex bg-gray-100 rounded-full p-1">
            <div className="px-4 py-1.5 text-sm rounded-full bg-white shadow-sm text-blue-600 font-medium cursor-pointer">
              Edit
            </div>
            <div className="px-4 py-1.5 text-sm text-gray-600 cursor-pointer">
              Preview
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700"
              onClick={handleViewPublished}
            >
              <FiEye className="w-4 h-4" />
              View Published Story
            </button>
            <button
              onClick={handleAddResource}
              className="flex items-center gap-2 bg-white text-blue-600 border border-blue-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-50"
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
