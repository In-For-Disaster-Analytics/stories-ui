import React from 'react';
import { useStory } from '../StoryContext';

const Sidebar: React.FC = () => {
  const {
    status,
    publishedDate,
    lastUpdated,
    views,
    downloads,
    shares,
    citations,
    dataset,
  } = useStory();

  return (
    <aside className="w-72 flex-shrink-0">
      {/* Status Section */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-green-500">{status}</span>
          </div>
          <button className="text-sm text-gray-600 bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-full">
            Unpublish
          </button>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mb-4">
          <div>Published: {publishedDate}</div>
          <div>Last updated: {lastUpdated}</div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-gray-50 rounded p-2.5 text-center">
            <div className="text-xl font-semibold text-gray-900">
              {views.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Views</div>
          </div>
          <div className="bg-gray-50 rounded p-2.5 text-center">
            <div className="text-xl font-semibold text-gray-900">
              {downloads}
            </div>
            <div className="text-xs text-gray-600">Downloads</div>
          </div>
          <div className="bg-gray-50 rounded p-2.5 text-center">
            <div className="text-xl font-semibold text-gray-900">{shares}</div>
            <div className="text-xs text-gray-600">Shares</div>
          </div>
          <div className="bg-gray-50 rounded p-2.5 text-center">
            <div className="text-xl font-semibold text-gray-900">
              {citations}
            </div>
            <div className="text-xs text-gray-600">Citations</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
