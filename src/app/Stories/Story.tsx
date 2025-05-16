import React from 'react';
import { useParams } from 'react-router-dom';
import { useDetailDataset } from '../../hooks/ckan/datasets/useDetailDataset';
// import { FiEye, FiPlus } from 'react-icons/fi';
import AddResourceModal from '../../components/AddResourceModal/AddResourceModal';
import { useResourceManagement } from '../../hooks/useResourceManagement';
import ResourcesPanel from '../../components/ResourcesPanel/ResourcesPanel';
import Footer from './_components/Footer';
import Editor from './_components/Editor';
import Sidebar from './_components/Sidebar';
import Header from './_components/Header';

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

const Story: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dataset } = useDetailDataset(id);
  const { isModalOpen, setIsModalOpen, isPending, error } =
    useResourceManagement(id);

  const handleAddResource = () => {
    setIsModalOpen(true);
  };

  const handlePreviewResource = (resourceId: string) => {
    console.log('Preview resource:', resourceId);
    // Implement preview functionality
  };

  const handleEmbedResource = (resourceId: string) => {
    console.log('Embed resource:', resourceId);
    // Implement embed functionality
  };

  const handlePreview = () => {
    // Implement preview functionality
  };

  const handleSave = () => {
    // Implement save functionality
  };

  const handleViewPublished = () => {
    // Implement view published story functionality
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title={dataset?.title || dataset?.name || ''}
        onAddResource={handleAddResource}
        onViewPublished={handleViewPublished}
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Sidebar />
          <Editor
            title={dataset?.title || dataset?.name || ''}
            subtitle="A comprehensive analysis of water quality trends and environmental impacts"
            onTitleChange={() => {}}
            onSubtitleChange={() => {}}
          />
        </div>
      </main>

      <Footer onPreview={handlePreview} onSave={handleSave} />

      <AddResourceModal
        id={id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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

export default Story;
