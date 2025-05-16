import React from 'react';
import { useParams } from 'react-router-dom';
import AddResourceModal from '../../components/AddResourceModal/AddResourceModal';
import ResourcesPanel from '../../components/ResourcesPanel/ResourcesPanel';
import Footer from './_components/Footer';
import Editor from './_components/Editor';
import Sidebar from './_components/Sidebar';
import Header from './_components/Header';
import { StoryProvider, useStory } from './StoryContext';

// Mock data for resources
const mockResources = [
  {
    id: '1',
    name: 'Water Quality Dataset 2023',
    type: 'CSV',
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'Interview Recording',
    type: 'MP3',
    size: '15.8 MB',
  },
  {
    id: '3',
    name: 'Interview with Sean Turner - Water Resources Modeler',
    type: 'MP4',
    size: '45.2 MB',
  },
];

const StoryContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    isModalOpen,
    isPending,
    error,
    handleCloseModal,
    handleAddResource,
    handlePreviewResource,
    handleEmbedResource,
  } = useStory();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Sidebar />
          <Editor />
        </div>
      </main>

      <Footer />

      <AddResourceModal
        id={id}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isSubmitting={isPending}
        error={error}
      />

      <ResourcesPanel
        resources={mockResources}
        onAddResource={handleAddResource}
        onPreviewResource={handlePreviewResource}
        onEmbedResource={handleEmbedResource}
      />
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
