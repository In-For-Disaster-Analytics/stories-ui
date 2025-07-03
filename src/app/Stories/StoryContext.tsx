import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useDetailDataset } from '../../hooks/ckan/datasets/useDetailDataset';
import { Resource } from '../../types/resource';
import { RawResource } from '../../types/resource';

// TODO: Import proper type from your CKAN types
interface Dataset {
  title?: string;
  name?: string;
  // Add other dataset properties as needed
}

interface ErrorState {
  message: string;
  code?: string;
}

interface StoryContextType {
  title: string;
  subtitle: string;
  status: string;
  publishedDate: string;
  lastUpdated: string;
  views: number;
  downloads: number;
  shares: number;
  citations: number;
  dataset: Dataset | null;
  isModalOpen: boolean;
  isPending: boolean;
  setIsPending: (isPending: boolean) => void;
  error: ErrorState | null;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  handleAddResource: () => void;
  handleCloseModal: () => void;
  handlePreviewResource: (resourceId: string) => void;
  handleEmbedResource: (resourceId: string) => void;
  handlePreview: () => void;
  handleSave: () => void;
  handleViewPublished: () => void;
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

interface StoryProviderProps {
  children: ReactNode;
  id: string;
}

export const StoryProvider: React.FC<StoryProviderProps> = ({
  children,
  id,
}) => {
  const { dataset } = useDetailDataset(id);
  const [resources, setResources] = useState<Resource[]>([]);
  const [title, setTitle] = useState(dataset?.title || dataset?.name || '');
  const [subtitle, setSubtitle] = useState(
    'A comprehensive analysis of water quality trends and environmental impacts',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const handleAddResource = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
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

  useEffect(() => {
    if (dataset) {
      setResources(
        dataset.resources.map((resource: RawResource) => {
          return {
            id: resource.id,
            name: resource.name,
            description: resource.description,
            format: resource.format,
            size: resource.size,
            url: resource.url,
            created: resource.created,
            modified: resource.modified,
            state: resource.state,
            hash: resource.hash,
            languages: resource.language,
            mimetype: resource.mimetype,
            additionalData: resource.additionalData,
            dataset: {
              id: resource.package_id,
            },
          } as Resource;
        }),
      );
    }
  }, [dataset]);

  const value = {
    title,
    subtitle,
    status: 'Published',
    publishedDate: 'May 10, 2025',
    lastUpdated: '2 days ago',
    views: 1245,
    downloads: 87,
    shares: 32,
    citations: 18,
    dataset: dataset || null,
    isModalOpen,
    isPending,
    setIsPending,
    error,
    setTitle,
    setSubtitle,
    handleAddResource,
    handleCloseModal,
    handlePreviewResource,
    handleEmbedResource,
    handlePreview,
    handleSave,
    handleViewPublished,
    resources,
    setResources,
  };

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
