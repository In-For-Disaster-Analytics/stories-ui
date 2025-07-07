import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { Resource } from '../../../types/resource';
import {
  TranscriptionData,
  TranscriptionSegment,
  TranscriptionEditorConfig,
} from '../../../types/transcription';
import { useStory } from '../../Stories/StoryContext';
import { useUpdateResource } from '../../../hooks/ckan/resources/useUpdateResource';
import useAccessToken from '../../../hooks/auth/useAccessToken';
import { splitTextIntelligently } from '../../../utils/textSplitting';
import { Sidebar, Editor, AnnotationModal } from './_components';

const TranscriptionEditor: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const history = useHistory();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { resources } = useStory();
  const resource = resources.find((r) => r.id === resourceId);
  const {
    updateResourceAsync,
    isPending: isSaving,
    error: saveError,
  } = useUpdateResource();
  const { accessToken } = useAccessToken();

  // State management
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [isLoadingTranscription, setIsLoadingTranscription] = useState(true);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(
    null,
  );
  const [selectedMediaResource, setSelectedMediaResource] =
    useState<Resource | null>(null);
  const [config] = useState<TranscriptionEditorConfig>({
    maxCPS: 20,
  });

  // Use refs to avoid re-renders for frequently changing values
  const currentPlayTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);

  // State for UI updates (throttled)
  const [displayTime, setDisplayTime] = useState(0);
  const [canPlay, setCanPlay] = useState(false);

  // Annotation modal state
  const [isAnnotationModalOpen, setIsAnnotationModalOpen] = useState(false);
  const [currentAnnotationSegment, setCurrentAnnotationSegment] =
    useState<TranscriptionSegment | null>(null);
  const [currentAnnotationIndex, setCurrentAnnotationIndex] = useState<
    number | null
  >(null);

  // Get available audio/video resources from the dataset
  const mediaResources = resources.filter(
    (r) => r.mimetype?.startsWith('audio/') || r.mimetype?.startsWith('video/'),
  );

  const getMediaElement = useCallback((): HTMLMediaElement | null => {
    if (selectedMediaResource?.mimetype?.startsWith('audio/')) {
      return audioRef.current;
    } else if (selectedMediaResource?.mimetype?.startsWith('video/')) {
      return videoRef.current;
    }
    return null;
  }, [selectedMediaResource]);

  // Load transcription data
  const fetchTranscriptionData = useCallback(async () => {
    if (!resource) return;

    setIsLoadingTranscription(true);
    setTranscriptionError(null);

    try {
      // Check if URL is from CKAN TACC and add auth headers
      const headers: HeadersInit = {};
      let data: TranscriptionData;
      if (!accessToken) {
        setTranscriptionError('Authentication token is required');
        return;
      }
      if (resource.url.includes('ckan.tacc.utexas.edu')) {
        console.log('auth', resource.url);
        headers['Authorization'] = `Bearer ${accessToken}`;
        const response = await fetch(resource.url, {
          method: 'GET',
          headers,
        });
        if (!response.ok) {
          throw new Error(
            `Failed to load transcription: ${response.statusText}`,
          );
        }
        data = await response.json();
      } else {
        console.log('no auth', resource.url);
        const response = await fetch(resource.url);
        if (!response.ok) {
          throw new Error(
            `Failed to load transcription: ${response.statusText}`,
          );
        }
        data = await response.json();
      }

      // Convert speakers to segments for easier editing
      const segments: TranscriptionSegment[] = data.speakers.map((speaker) => ({
        speaker: speaker.speaker,
        timestamp: speaker.timestamp,
        text: speaker.text,
        annotation: (speaker as TranscriptionSegment).annotation, // Preserve annotation if it exists
      }));
      setSegments(segments);
    } catch (error) {
      console.error('Error loading transcription data:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load transcription data';
      setTranscriptionError(errorMessage);
    } finally {
      setIsLoadingTranscription(false);
    }
  }, [resource, accessToken]);

  useEffect(() => {
    if (resource) {
      fetchTranscriptionData();
    }
  }, [resource, fetchTranscriptionData]);

  // Throttled time update for UI (only update display every 100ms)
  const updateDisplayTime = useCallback((time: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > 100) {
      setDisplayTime(time);
      lastUpdateTimeRef.current = now;
    }
  }, []);

  // Time synchronization with tolerance to prevent infinite loops
  useEffect(() => {
    const tolerance = 0.1; // Tolerance level in seconds
    const mediaElement = getMediaElement();

    // Only sync if we're seeking (not during normal playback)
    if (
      canPlay &&
      mediaElement &&
      isSeekingRef.current &&
      Math.abs(mediaElement.currentTime - currentPlayTimeRef.current) >
        tolerance
    ) {
      try {
        const targetTime = currentPlayTimeRef.current;
        if (
          targetTime >= 0 &&
          targetTime <= (mediaElement.duration || Infinity)
        ) {
          mediaElement.currentTime = targetTime;
        }
      } catch (error) {
        console.error('Seeking failed:', error);
      }
      isSeekingRef.current = false; // Reset seeking flag
    }
  }, [displayTime, canPlay, getMediaElement]);

  // Stable event handlers to prevent re-renders
  const handleTimeUpdate = useCallback(
    (time: number) => {
      currentPlayTimeRef.current = time;
      updateDisplayTime(time);
    },
    [updateDisplayTime],
  );

  const handleCanPlay = useCallback(() => {
    setCanPlay(true);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    setCanPlay(true);
  }, []);

  const seekToTime = (time: number) => {
    currentPlayTimeRef.current = time;
    isSeekingRef.current = true;
    setDisplayTime(time);
  };

  const handleTimestampClick = (time: number) => {
    seekToTime(time);
  };

  const updateSegment = (
    index: number,
    field: keyof TranscriptionSegment,
    value: string | [number, number],
  ) => {
    const newSegments = [...segments];
    if (field === 'timestamp') {
      newSegments[index] = {
        ...newSegments[index],
        [field]: value as [number, number],
      };
    } else {
      newSegments[index] = { ...newSegments[index], [field]: value as string };
    }
    setSegments(newSegments);
  };

  const addSegment = (afterIndex: number) => {
    const newSegment: TranscriptionSegment = {
      speaker: 'SPEAKER_NEW',
      timestamp: [
        segments[afterIndex]?.timestamp[1] || 0,
        (segments[afterIndex]?.timestamp[1] || 0) + 5,
      ],
      text: 'New segment text',
    };
    const newSegments = [...segments];
    newSegments.splice(afterIndex + 1, 0, newSegment);
    setSegments(newSegments);
  };

  const deleteSegment = (index: number) => {
    const newSegments = segments.filter((_, i) => i !== index);
    setSegments(newSegments);
  };

  const splitSegment = (index: number) => {
    const segment = segments[index];

    // Prevent splitting segments with annotations
    if (segment.annotation && segment.annotation.trim().length > 0) {
      alert(
        'Cannot split segments that have annotations. Please remove the annotation first if you want to split this segment.',
      );
      return;
    }

    const midTime = (segment.timestamp[0] + segment.timestamp[1]) / 2;

    // Use the utility function to split the text intelligently
    const [firstText, secondText] = splitTextIntelligently(segment.text);

    const firstHalf: TranscriptionSegment = {
      ...segment,
      timestamp: [segment.timestamp[0], midTime],
      text: firstText,
      annotation: undefined, // Clear annotation for safety
    };

    const secondHalf: TranscriptionSegment = {
      ...segment,
      timestamp: [midTime, segment.timestamp[1]],
      text: secondText,
      annotation: undefined, // Clear annotation for safety
    };

    const newSegments = [...segments];
    newSegments.splice(index, 1, firstHalf, secondHalf);
    setSegments(newSegments);
  };

  const saveTranscription = async () => {
    if (!resource || !segments.length) {
      alert('No transcription data to save');
      return;
    }

    try {
      // Convert segments back to TranscriptionData format
      const transcriptionData: TranscriptionData = {
        speakers: segments.map((segment) => ({
          speaker: segment.speaker,
          timestamp: segment.timestamp,
          text: segment.text,
          ...(segment.annotation && { annotation: segment.annotation }), // Include annotation if it exists
        })),
        chunks: segments.map((segment) => ({
          timestamp: segment.timestamp,
          text: segment.text,
        })),
        text: segments.map((segment) => segment.text).join(' '),
      };

      // Create a file with the updated transcription data
      const transcriptionBlob = new Blob(
        [JSON.stringify(transcriptionData, null, 2)],
        {
          type: resource.mimetype || 'application/json',
        },
      );

      const transcriptionFile = new File(
        [transcriptionBlob],
        resource.name || 'transcription.json',
        { type: resource.mimetype || 'application/json' },
      );

      // Update the resource with the new transcription data
      await updateResourceAsync({
        id: resource.id,
        file: transcriptionFile,
        name: resource.name,
        description: resource.description || 'Updated transcription data',
        format: resource.format || 'JSON',
        mimetype: resource.mimetype || 'application/json',
      });

      alert('Transcription saved successfully!');
    } catch (error) {
      console.error('Error saving transcription:', error);
      alert('Failed to save transcription. Please try again.');
    }
  };

  const handleMediaResourceSelect = (mediaResource: Resource) => {
    setSelectedMediaResource(mediaResource);
    setCanPlay(false);
    currentPlayTimeRef.current = 0;
    setDisplayTime(0);
    isSeekingRef.current = false;
  };

  const handleAnnotateSegment = (index: number) => {
    setCurrentAnnotationSegment(segments[index]);
    setCurrentAnnotationIndex(index);
    setIsAnnotationModalOpen(true);
  };

  const handleCloseAnnotationModal = () => {
    setIsAnnotationModalOpen(false);
    setCurrentAnnotationSegment(null);
    setCurrentAnnotationIndex(null);
  };

  const handleSaveAnnotation = (annotation: string) => {
    if (currentAnnotationIndex !== null) {
      updateSegment(
        currentAnnotationIndex,
        'annotation',
        annotation.trim() || '',
      );
    }
  };

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Resource not found
          </h2>
          <button
            onClick={() => history.goBack()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log('TranscriptionEditor', 're-render');
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => history.goBack()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Transcription
                </h1>
                <p className="text-gray-600">{resource.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={saveTranscription}
                disabled={isSaving || !segments.length}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  isSaving || !segments.length
                    ? 'text-gray-400 bg-gray-300 cursor-not-allowed'
                    : 'text-white bg-green-600 hover:bg-green-700'
                }`}
              >
                <FiSave className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Display */}
        {saveError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="text-sm text-red-600">
              <strong>Save Error:</strong> {saveError.message}
            </div>
          </div>
        )}

        {/* Transcription Load Error */}
        {transcriptionError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="text-sm text-red-600">
              <strong>Load Error:</strong> {transcriptionError}
              <button
                onClick={fetchTranscriptionData}
                className="ml-2 text-blue-600 hover:text-blue-700 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Media Player Section - Full Screen */}
        <div className="mb-6">
          <Sidebar
            mediaResources={mediaResources}
            selectedMediaResource={selectedMediaResource}
            audioRef={audioRef}
            videoRef={videoRef}
            onMediaResourceSelect={handleMediaResourceSelect}
            onTimeUpdate={handleTimeUpdate}
            onCanPlay={handleCanPlay}
            onLoadedMetadata={handleLoadedMetadata}
          />
        </div>

        {/* Editor Section - Full Width */}
        <div className="bg-white rounded-lg shadow-sm border">
          {isLoadingTranscription ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transcription segments...</p>
            </div>
          ) : transcriptionError ? (
            <div className="p-8 text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Failed to Load Transcription
              </h3>
              <p className="text-gray-600 mb-4">{transcriptionError}</p>
              <button
                onClick={fetchTranscriptionData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : segments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Transcription Segments
              </h3>
              <p className="text-gray-600">
                This transcription file appears to be empty or has no segments.
              </p>
            </div>
          ) : (
            <Editor
              segments={segments}
              config={config}
              currentTime={displayTime}
              onUpdateSegment={updateSegment}
              onAddSegment={addSegment}
              onDeleteSegment={deleteSegment}
              onSplitSegment={splitSegment}
              onTimestampClick={handleTimestampClick}
              onAnnotateSegment={handleAnnotateSegment}
            />
          )}
        </div>
      </div>

      {/* Annotation Modal */}
      <AnnotationModal
        isOpen={isAnnotationModalOpen}
        onClose={handleCloseAnnotationModal}
        segment={currentAnnotationSegment}
        onSave={handleSaveAnnotation}
      />
    </div>
  );
};

export default TranscriptionEditor;
