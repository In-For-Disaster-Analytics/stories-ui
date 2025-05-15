import React from 'react';
import { useParams } from 'react-router-dom';
import { useDetailDataset } from '../../hooks/ckan/datasets/useDetailDataset';
import {
  FiEye,
  FiPlus,
  FiType,
  FiAlignLeft,
  FiAlignCenter,
} from 'react-icons/fi';
import { BsCheckCircle } from 'react-icons/bs';
import AddResourceModal from '../../components/AddResourceModal/AddResourceModal';
import { useResourceManagement } from '../../hooks/useResourceManagement';

const Story: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dataset } = useDetailDataset(id);
  const { isModalOpen, setIsModalOpen, isPending, error } =
    useResourceManagement(id);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-1">Story Editor</h1>
          <p className="text-sm text-gray-600 mb-4">
            {dataset?.title || dataset?.name}
          </p>
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
              <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700">
                <FiEye className="w-4 h-4" />
                View Published Story
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-white text-blue-600 border border-blue-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-50"
              >
                <FiPlus className="w-4 h-4" />
                Add Resource
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0">
            {/* Status Section */}
            <div className="bg-white rounded-lg shadow-sm p-5 mb-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-500">
                    Published
                  </span>
                </div>
                <button className="text-sm text-gray-600 bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-full">
                  Unpublish
                </button>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mb-4">
                <div>Published: May 10, 2025</div>
                <div>Last updated: 2 days ago</div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-gray-50 rounded p-2.5 text-center">
                  <div className="text-xl font-semibold text-gray-900">
                    1,245
                  </div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
                <div className="bg-gray-50 rounded p-2.5 text-center">
                  <div className="text-xl font-semibold text-gray-900">87</div>
                  <div className="text-xs text-gray-600">Downloads</div>
                </div>
                <div className="bg-gray-50 rounded p-2.5 text-center">
                  <div className="text-xl font-semibold text-gray-900">32</div>
                  <div className="text-xs text-gray-600">Shares</div>
                </div>
                <div className="bg-gray-50 rounded p-2.5 text-center">
                  <div className="text-xl font-semibold text-gray-900">18</div>
                  <div className="text-xs text-gray-600">Citations</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Editor Area */}
          <div className="flex-1">
            {/* Editor Toolbar */}
            <div className="bg-white rounded-t-lg shadow-sm p-4 border-b border-gray-100">
              <div className="flex gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 border-r border-gray-100">
                  <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50">
                    <FiType className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50">
                    <FiAlignLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50">
                    <FiAlignCenter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="bg-white rounded-b-lg shadow-sm p-5 min-h-[600px]">
              <input
                type="text"
                className="w-full text-2xl font-bold mb-2.5 pb-2.5 border-b border-gray-100 focus:outline-none"
                placeholder="Enter story title..."
                defaultValue={dataset?.title || dataset?.name}
              />
              <input
                type="text"
                className="w-full text-base text-gray-600 mb-5 pb-2.5 border-b border-gray-100 focus:outline-none"
                placeholder="Enter subtitle..."
                defaultValue="A comprehensive analysis of water quality trends and environmental impacts"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-5 mt-10 sticky bottom-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <BsCheckCircle className="w-3.5 h-3.5" />
              All changes saved
            </div>
            <div className="flex gap-4">
              <button className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100">
                Preview
              </button>
              <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Add Resource Modal */}
      <AddResourceModal
        id={id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isSubmitting={isPending}
        error={error}
      />
    </div>
  );
};

export default Story;
