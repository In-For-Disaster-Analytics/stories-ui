import { useState } from 'react';
import { useCreateResource } from './ckan/resources/useCreateResource';

export interface ResourceData {
  name: string;
  description: string;
  files: File[];
}

export const useResourceManagement = (packageId: string) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createResourceAsync, isPending, isError, error } =
    useCreateResource();

  const handleAddResource = async (data: ResourceData) => {
    try {
      const result = await createResourceAsync({
        package_id: packageId,
        name: data.name,
        description: data.description,
        files: data.files,
      });

      return result;
    } catch (error) {
      console.error('Failed to create resource:', error);
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
  };
};
