import { useState, useEffect, useCallback } from 'react';
import { useCreateResource } from './useCreateResource';
import { useUpdateResource } from './useUpdateResource';
import { Resource } from '../../../types/resource';
import useAccessToken from '../../auth/useAccessToken';

interface UseNotesResourceProps {
  datasetId: string;
  resources: Resource[];
}

export const useNotesResource = ({ datasetId, resources }: UseNotesResourceProps) => {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { createResourceAsync } = useCreateResource();
  const { updateResourceAsync } = useUpdateResource();
  const { accessToken } = useAccessToken();

  // Find existing Notes.txt resource
  const notesResource = resources.find(
    (r) => r.name === 'Notes.txt' && r.format?.toLowerCase() === 'txt'
  );

  // Load notes from existing resource
  const loadNotes = useCallback(async () => {
    if (!notesResource) {
      setNotes('');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const headers: HeadersInit = {};
      if (notesResource.url.includes('ckan.tacc.utexas.edu') && accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(notesResource.url, { headers });
      if (!response.ok) {
        throw new Error('Failed to load notes');
      }

      const notesContent = await response.text();
      setNotes(notesContent);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading notes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [notesResource, accessToken]);

  // Save notes to resource
  const saveNotes = useCallback(async (notesContent: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create text file
      const notesBlob = new Blob([notesContent], { type: 'text/plain' });
      const notesFile = new File([notesBlob], 'Notes.txt', { type: 'text/plain' });

      if (notesResource) {
        // Update existing resource
        await updateResourceAsync({
          id: notesResource.id,
          file: notesFile,
          name: 'Notes.txt',
          description: 'Story notes and documentation',
          format: 'TXT',
          mimetype: 'text/plain',
        });
      } else {
        // Create new resource
        await createResourceAsync({
          package_id: datasetId,
          name: 'Notes.txt',
          description: 'Story notes and documentation',
          format: 'TXT',
          file: notesFile,
        });
      }

      setNotes(notesContent);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error saving notes:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notesResource, datasetId, createResourceAsync, updateResourceAsync]);

  // Load notes when component mounts or notesResource changes
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    setNotes,
    saveNotes,
    isLoading,
    error,
    hasNotesResource: !!notesResource,
  };
};