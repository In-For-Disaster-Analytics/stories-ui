import { useState } from 'react';
import { useCreateMultipleResources } from './ckan/resources/useCreateMultipleResources';

export interface ResourceData {
  name?: string;
  description?: string;
  files: File[];
}

export const useResourceManagement = (packageId: string) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    createMultipleResourcesAsync,
    isPending,
    isError,
    error,
    getFileStatus,
  } = useCreateMultipleResources();

  const handleAddResource = async (data: ResourceData) => {
    try {
      const results = await createMultipleResourcesAsync({
        package_id: packageId,
        resources: data.files.map((file) => ({
          name: data.name || file.name || 'Untitled Resource',
          description: data.description,
          file: file,
        })),
      });

      return results;
    } catch (error) {
      console.error('Failed to create resources:', error);
      throw error;
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    handleAddResource,
    isPending,
    isError,
    error,
    getFileStatus,
  };
};
