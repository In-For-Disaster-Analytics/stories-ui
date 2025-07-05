import React from 'react';
import { useParams } from 'react-router-dom';
import AddResourceModal from '../../components/AddResourceModal/AddResourceModal';
import Footer from './_components/Footer';
import Editor from './_components/Editor';
import Header from './_components/Header';
import { StoryProvider } from './StoryContext';

const StoryContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Editor />
        </div>
      </main>

      <Footer />

      <AddResourceModal id={id} />
    </div>
  );
};

const Story: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <StoryProvider id={id || ''}>
      <StoryContent />
    </StoryProvider>
  );
};

export default Story;
