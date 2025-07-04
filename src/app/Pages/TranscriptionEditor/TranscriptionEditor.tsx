import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import {
  FiArrowLeft,
  FiPlay,
  FiPause,
  FiVolume2,
  FiSettings,
  FiSave,
  FiPlus,
  FiTrash2,
  FiScissors,
} from 'react-icons/fi';
import { Resource } from '../../../types/resource';
import {
  TranscriptionData,
  TranscriptionSegment,
  TranscriptionEditorConfig,
} from '../../../types/transcription';

const TranscriptionEditor: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const location = useLocation();
  const history = useHistory();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get resource from navigation state
  const resource = (location.state as { resource?: Resource })?.resource;

  // State management
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [config, setConfig] = useState<TranscriptionEditorConfig>({
    seekOnClick: true,
    maxCPS: 20,
  });

  const getMediaElement = useCallback((): HTMLMediaElement | null => {
    if (resource?.mimetype?.startsWith('audio/')) {
      return audioRef.current;
    } else if (resource?.mimetype?.startsWith('video/')) {
      return videoRef.current;
    }
    return null;
  }, [resource]);

  // Load transcription data
  const fetchTranscriptionData = useCallback(async () => {
    if (!resource) return;

    try {
      const response = await fetch(resource.url);
      const data: TranscriptionData = await response.json();
      
      // Convert speakers to segments for easier editing
      const segments: TranscriptionSegment[] = data.speakers.map(speaker => ({
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

  // Media player event handlers
  useEffect(() => {
    const mediaElement = getMediaElement();
    if (!mediaElement) return;

    const handleTimeUpdate = () => setCurrentTime(mediaElement.currentTime);
    const handleDurationChange = () => setDuration(mediaElement.duration);
    const handleEnded = () => setIsPlaying(false);

    mediaElement.addEventListener('timeupdate', handleTimeUpdate);
    mediaElement.addEventListener('durationchange', handleDurationChange);
    mediaElement.addEventListener('ended', handleEnded);

    return () => {
      mediaElement.removeEventListener('timeupdate', handleTimeUpdate);
      mediaElement.removeEventListener('durationchange', handleDurationChange);
      mediaElement.removeEventListener('ended', handleEnded);
    };
  }, [getMediaElement]);

  const togglePlayPause = () => {
    const mediaElement = getMediaElement();
    if (!mediaElement) return;

    if (isPlaying) {
      mediaElement.pause();
    } else {
      mediaElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekToTime = (time: number) => {
    const mediaElement = getMediaElement();
    if (!mediaElement) return;

    mediaElement.currentTime = time;
    setCurrentTime(time);
  };

  const handleTimestampClick = (time: number) => {
    if (config.seekOnClick) {
      seekToTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const mediaElement = getMediaElement();
    if (!mediaElement) return;

    mediaElement.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCPS = (text: string, duration: number): number => {
    return duration > 0 ? text.length / duration : 0;
  };

  const updateSegment = (index: number, field: keyof TranscriptionSegment, value: string | [number, number]) => {
    const newSegments = [...segments];
    if (field === 'timestamp') {
      newSegments[index] = { ...newSegments[index], [field]: value as [number, number] };
    } else {
      newSegments[index] = { ...newSegments[index], [field]: value as string };
    }
    setSegments(newSegments);
  };

  const addSegment = (afterIndex: number) => {
    const newSegment: TranscriptionSegment = {
      speaker: 'SPEAKER_NEW',
      timestamp: [segments[afterIndex]?.timestamp[1] || 0, (segments[afterIndex]?.timestamp[1] || 0) + 5],
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

  // Suppress unused variable warnings
  console.log('Resource ID:', resourceId);

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource not found</h2>
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Transcription</h1>
                <p className="text-gray-600">{resource.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setConfig({ ...config, seekOnClick: !config.seekOnClick })}
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
          {/* Media Player */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Player</h3>
              
              {/* Audio/Video Element */}
              <div className="mb-4">
                {resource.mimetype?.startsWith('audio/') && (
                  <audio
                    ref={audioRef}
                    src={resource.url}
                    className="w-full"
                    controls
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                )}
                {resource.mimetype?.startsWith('video/') && (
                  <video
                    ref={videoRef}
                    src={resource.url}
                    className="w-full rounded-lg"
                    controls
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                )}
              </div>

              {/* Custom Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={togglePlayPause}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                  </button>
                  <div className="flex items-center space-x-2">
                    <FiVolume2 className="w-4 h-4 text-gray-500" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 text-center">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transcription Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Transcription Segments ({segments.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Speaker
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Text
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {segments.map((segment, index) => {
                      const duration = segment.timestamp[1] - segment.timestamp[0];
                      const cps = calculateCPS(segment.text, duration);
                      const isHighCPS = cps > config.maxCPS;
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => addSegment(index)}
                                className="text-green-600 hover:text-green-900"
                                title="Add segment"
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => splitSegment(index)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Split segment"
                              >
                                <FiScissors className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteSegment(index)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete segment"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={segment.speaker}
                              onChange={(e) => updateSegment(index, 'speaker', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleTimestampClick(segment.timestamp[0])}
                              className="text-blue-600 hover:text-blue-900 text-sm font-mono"
                            >
                              {formatTime(segment.timestamp[0])}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleTimestampClick(segment.timestamp[1])}
                              className="text-blue-600 hover:text-blue-900 text-sm font-mono"
                            >
                              {formatTime(segment.timestamp[1])}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <textarea
                              value={segment.text}
                              onChange={(e) => updateSegment(index, 'text', e.target.value)}
                              className={`w-full px-2 py-1 border rounded text-sm resize-none ${
                                isHighCPS ? 'border-red-300 bg-red-50' : 'border-gray-300'
                              }`}
                              rows={2}
                            />
                            {isHighCPS && (
                              <div className="text-xs text-red-600 mt-1">
                                High CPS: {cps.toFixed(1)} chars/sec
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionEditor;