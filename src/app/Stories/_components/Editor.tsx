import React from 'react';
import { useStory } from '../StoryContext';

const EditorContent: React.FC = () => {
  const { notes, setNotes, isNotesLoading, notesError, hasNotesResource } =
    useStory();

  if (isNotesLoading) {
    return (
      <div className="bg-white rounded-b-lg shadow-sm p-5 min-h-[600px] flex items-center justify-center">
        <div className="text-gray-500">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-lg shadow-sm p-5 min-h-[600px]">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Story Notes</h3>
          <div className="text-sm text-gray-500">
            {hasNotesResource ? 'Notes.txt' : 'New notes document'}
          </div>
        </div>
        {notesError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            Error: {notesError}
          </div>
        )}
      </div>

      <textarea
        className="w-full h-full min-h-[500px] text-base text-gray-700 border border-gray-200 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        placeholder="Write your story notes here...\n\nThis is a plain text editor for taking notes about your story. You can write detailed observations, ideas, and documentation here."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
};

const Editor: React.FC = () => {
  return (
    <div className="flex-1 container gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <EditorContent />
    </div>
  );
};

export default Editor;
