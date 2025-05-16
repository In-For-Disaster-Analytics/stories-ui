import { useState } from 'react';
import { useCreateResource } from './useCreateResource';

export interface MultipleResourceData {
  package_id: string;
  resources: Array<{
    name?: string;
    description?: string;
    file: File;
  }>;
}

export type ResourceStatus = 'pending' | 'success' | 'error';

export interface ResourceResult<T = unknown> {
  status: ResourceStatus;
  error?: Error;
  result?: T;
}

export const useCreateMultipleResources = () => {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fileStatuses, setFileStatuses] = useState<Map<string, ResourceResult>>(
    new Map(),
  );
  const { createResourceAsync } = useCreateResource();

  const createMultipleResourcesAsync = async (data: MultipleResourceData) => {
    setIsPending(true);
    setIsError(false);
    setError(null);

    // Initialize status for all files
    const initialStatuses = new Map(
      data.resources.map((resource) => [
        resource.file.name,
        { status: 'pending' as ResourceStatus },
      ]),
    );
    setFileStatuses(initialStatuses);

    try {
      const results = await Promise.all(
        data.resources.map(async (resource) => {
          try {
            const result = await createResourceAsync({
              package_id: data.package_id,
              name: resource.name || resource.file.name || 'Untitled Resource',
              description: resource.description,
              file: resource.file,
            });

            // Update status for successful file
            setFileStatuses((prev) =>
              new Map(prev).set(resource.file.name, {
                status: 'success',
                result,
              }),
            );

            return result;
          } catch (fileError) {
            // Update status for failed file
            setFileStatuses((prev) =>
              new Map(prev).set(resource.file.name, {
                status: 'error',
                error:
                  fileError instanceof Error
                    ? fileError
                    : new Error('Failed to create resource'),
              }),
            );
            throw fileError;
          }
        }),
      );

      setIsPending(false);
      return results;
    } catch (error) {
      setIsError(true);
      setError(
        error instanceof Error
          ? error
          : new Error('Failed to create resources'),
      );
      setIsPending(false);
      throw error;
    }
  };

  const getFileStatus = (fileName: string): ResourceResult | undefined => {
    return fileStatuses.get(fileName);
  };

  const getAllFileStatuses = (): Map<string, ResourceResult> => {
    return fileStatuses;
  };

  return {
    createMultipleResourcesAsync,
    isPending,
    isError,
    error,
    getFileStatus,
    getAllFileStatuses,
  };
};
