import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiSettings, FiSave } from 'react-icons/fi';
import { Resource } from '../../../types/resource';
import {
  TranscriptionData,
  TranscriptionSegment,
  TranscriptionEditorConfig,
} from '../../../types/transcription';
import { useStory } from '../../Stories/StoryContext';
import { Sidebar, Editor } from './_components';

const TranscriptionEditor: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { resources } = useStory();

  // Get resource from navigation state
  const resource = (location.state as { resource?: Resource })?.resource;

  // State management
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [selectedMediaResource, setSelectedMediaResource] =
    useState<Resource | null>(null);
  const [config, setConfig] = useState<TranscriptionEditorConfig>({
    seekOnClick: true,
    maxCPS: 20,
  });

  // Use refs to avoid re-renders for frequently changing values
  const currentPlayTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);

  // State for UI updates (throttled)
  const [displayTime, setDisplayTime] = useState(0);
  const [canPlay, setCanPlay] = useState(false);

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

    try {
      const response = await fetch(resource.url);
      const data: TranscriptionData = await response.json();

      // Convert speakers to segments for easier editing
      const segments: TranscriptionSegment[] = data.speakers.map((speaker) => ({
        speaker: speaker.speaker,
        timestamp: speaker.timestamp,
        text: speaker.text,
      }));
      setSegments(segments);
    } catch (error) {
      console.error('Error loading transcription data:', error);
    }
  }, [resource]);

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
      console.log(
        'Syncing time:',
        mediaElement.currentTime,
        currentPlayTimeRef.current,
      );
      mediaElement.currentTime = currentPlayTimeRef.current;
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
    if (config.seekOnClick) {
      seekToTime(time);
    }
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
    const midTime = (segment.timestamp[0] + segment.timestamp[1]) / 2;
    const textMid = Math.floor(segment.text.length / 2);

    const firstHalf: TranscriptionSegment = {
      ...segment,
      timestamp: [segment.timestamp[0], midTime],
      text: segment.text.substring(0, textMid),
    };

    const secondHalf: TranscriptionSegment = {
      ...segment,
      timestamp: [midTime, segment.timestamp[1]],
      text: segment.text.substring(textMid),
    };

    const newSegments = [...segments];
    newSegments.splice(index, 1, firstHalf, secondHalf);
    setSegments(newSegments);
  };

  const saveTranscription = async () => {
    // TODO: Implement save functionality
    console.log('Saving transcription:', segments);
    alert('Transcription saved successfully!');
  };

  const handleMediaResourceSelect = (mediaResource: Resource) => {
    setSelectedMediaResource(mediaResource);
    setCanPlay(false);
    currentPlayTimeRef.current = 0;
    setDisplayTime(0);
    isSeekingRef.current = false;
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
                onClick={() =>
                  setConfig({ ...config, seekOnClick: !config.seekOnClick })
                }
                className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                  config.seekOnClick
                    ? 'border-blue-300 text-blue-700 bg-blue-50'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <FiSettings className="w-4 h-4 mr-2" />
                Seek on Click
              </button>
              <button
                onClick={saveTranscription}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <FiSave className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Component */}
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

          {/* Editor Component */}
          <Editor
            segments={segments}
            config={config}
            onUpdateSegment={updateSegment}
            onAddSegment={addSegment}
            onDeleteSegment={deleteSegment}
            onSplitSegment={splitSegment}
            onTimestampClick={handleTimestampClick}
          />
        </div>
      </div>
    </div>
  );
};

export default TranscriptionEditor;
