import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { useDetailDataset } from '../../hooks/ckan/datasets/useDetailDataset';
import { useUpdateDataset } from '../../hooks/ckan/datasets/useUpdateDataset';
import { useNotesResource } from '../../hooks/ckan/resources/useNotesResource';
import { Resource } from '../../types/resource';
import { RawResource } from '../../types/resource';
import { RawDataset } from '../../types/Dataset';

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
  dataset: RawDataset | null;
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
  // Dataset update functionality
  datasetTitle: string;
  datasetDescription: string;
  isDirty: boolean;
  isUpdating: boolean;
  updateError: ErrorState | null;
  setDatasetTitle: (title: string) => void;
  setDatasetDescription: (description: string) => void;
  // Notes functionality
  notes: string;
  setNotes: (notes: string) => void;
  isNotesLoading: boolean;
  notesError: string | null;
  hasNotesResource: boolean;
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
  const { dataset, refetch } = useDetailDataset(id);
  const {
    updateDatasetAsync,
    isPending: isUpdatingDataset,
    error: datasetUpdateError,
  } = useUpdateDataset();
  
  const [resources, setResources] = useState<Resource[]>([]);
  
  // Notes resource management
  const {
    notes,
    setNotes,
    saveNotes,
    isLoading: isNotesLoading,
    error: notesError,
    hasNotesResource,
  } = useNotesResource({
    datasetId: id,
    resources,
  });
  
  const [title, setTitle] = useState(dataset?.title || dataset?.name || '');
  const [subtitle, setSubtitle] = useState(
    'A comprehensive analysis of water quality trends and environmental impacts',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  
  // Dataset editing state
  const [datasetTitle, setDatasetTitle] = useState(dataset?.title || '');
  const [datasetDescription, setDatasetDescription] = useState(dataset?.notes || '');
  const [updateError, setUpdateError] = useState<ErrorState | null>(null);
  
  // Track original notes for dirty detection
  const [originalNotes, setOriginalNotes] = useState('');
  const hasLoadedInitialNotes = useRef(false);

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

  const handleSave = async () => {
    if (!dataset || !isDirty) return;

    try {
      // Save dataset metadata if changed
      const hasDatasetChanges = 
        datasetTitle !== (dataset?.title || '') || 
        datasetDescription !== (dataset?.notes || '');
      
      if (hasDatasetChanges) {
        await updateDatasetAsync({
          id: dataset.id,
          title: datasetTitle,
          notes: datasetDescription,
        });
      }
      
      // Save notes if changed
      const hasNotesChanges = notes !== originalNotes;
      if (hasNotesChanges) {
        await saveNotes(notes);
        setOriginalNotes(notes);
      }
      
      // Refresh dataset to get updated data
      await refetch();
    } catch (error) {
      console.error('Error saving:', error);
    }
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
      
      // Update dataset editing state when dataset changes
      setDatasetTitle(dataset.title || '');
      setDatasetDescription(dataset.notes || '');
    }
  }, [dataset]);

  // Update original notes only when notes are initially loaded
  useEffect(() => {
    // Only update originalNotes when notes are loaded for the first time
    if (!isNotesLoading && !notesError && !hasLoadedInitialNotes.current) {
      setOriginalNotes(notes);
      hasLoadedInitialNotes.current = true;
    }
  }, [isNotesLoading, notesError, notes]);

  // Check if dataset has unsaved changes
  const isDirty = 
    datasetTitle !== (dataset?.title || '') || 
    datasetDescription !== (dataset?.notes || '') ||
    notes !== originalNotes;

  // Handle dataset update errors
  useEffect(() => {
    if (datasetUpdateError) {
      setUpdateError({
        message: datasetUpdateError.message,
        code: 'DATASET_UPDATE_ERROR',
      });
    } else {
      setUpdateError(null);
    }
  }, [datasetUpdateError]);

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
    // Dataset update functionality
    datasetTitle,
    datasetDescription,
    isDirty,
    isUpdating: isUpdatingDataset,
    updateError,
    setDatasetTitle,
    setDatasetDescription,
    // Notes functionality
    notes,
    setNotes,
    isNotesLoading,
    notesError,
    hasNotesResource,
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
