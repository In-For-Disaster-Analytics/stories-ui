import React from 'react';
import { FiType, FiAlignLeft, FiAlignCenter } from 'react-icons/fi';
import { useStory } from '../StoryContext';

const EditorToolbar: React.FC = () => {
  return (
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
  );
};

const EditorContent: React.FC = () => {
  const { title, subtitle, setTitle, setSubtitle } = useStory();

  return (
    <div className="bg-white rounded-b-lg shadow-sm p-5 min-h-[600px]">
      <input
        type="text"
        className="w-full text-2xl font-bold mb-2.5 pb-2.5 border-b border-gray-100 focus:outline-none"
        placeholder="Enter story title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        className="w-full text-base text-gray-600 mb-5 pb-2.5 border-b border-gray-100 focus:outline-none"
        placeholder="Enter subtitle..."
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
    </div>
  );
};

const Editor: React.FC = () => {
  return (
    <div className="flex-1">
      {/* Editor Toolbar */}
      <EditorToolbar />
      {/* Editor Content */}
      <EditorContent />
    </div>
  );
};

export default Editor;
