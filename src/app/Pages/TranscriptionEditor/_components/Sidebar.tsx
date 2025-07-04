import React from 'react';
import { FiMusic } from 'react-icons/fi';
import { Resource } from '../../../../types/resource';

// Extracted audio component to prevent recreation on re-renders
function AudioPlayer({
  audioRef,
  selectedMediaResource,
  onTimeUpdate,
  onCanPlay,
  onLoadedMetadata,
}: {
  audioRef: React.RefObject<HTMLAudioElement>;
  selectedMediaResource: Resource;
  onTimeUpdate: (time: number) => void;
  onCanPlay: () => void;
  onLoadedMetadata: () => void;
}) {
  return (
    <audio
      key={`audio-${selectedMediaResource.id}`}
      ref={audioRef}
      src={selectedMediaResource.url}
      className="w-full"
      controls
      onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
      onCanPlay={onCanPlay}
      onLoadedMetadata={onLoadedMetadata}
    />
  );
}

// Extracted video component to prevent recreation on re-renders
function VideoPlayer({
  videoRef,
  selectedMediaResource,
  onTimeUpdate,
  onCanPlay,
  onLoadedMetadata,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  selectedMediaResource: Resource;
  onTimeUpdate: (time: number) => void;
  onCanPlay: () => void;
  onLoadedMetadata: () => void;
}) {
  return (
    <video
      ref={videoRef}
      src={selectedMediaResource.url}
      className="w-full rounded-lg"
      controls
      onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
      onCanPlay={onCanPlay}
      onLoadedMetadata={onLoadedMetadata}
    />
  );
}

interface SidebarProps {
  mediaResources: Resource[];
  selectedMediaResource: Resource | null;
  audioRef: React.RefObject<HTMLAudioElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  onMediaResourceSelect: (mediaResource: Resource) => void;
  onTimeUpdate: (time: number) => void;
  onCanPlay: () => void;
  onLoadedMetadata: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  mediaResources,
  selectedMediaResource,
  audioRef,
  videoRef,
  onMediaResourceSelect,
  onTimeUpdate,
  onCanPlay,
  onLoadedMetadata,
}) => {
  const getResourceDisplayName = (resource: Resource): string => {
    const type = resource.mimetype?.startsWith('audio/') ? '🎵' : '🎥';
    return `${type} ${resource.name}`;
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Media Player
        </h3>

        {/* Media Resource Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMusic className="inline w-4 h-4 mr-2" />
            Select Audio/Video
          </label>
          {mediaResources.length > 0 ? (
            <select
              value={selectedMediaResource?.id || ''}
              onChange={(e) => {
                const selected = mediaResources.find(
                  (r) => r.id === e.target.value,
                );
                if (selected) onMediaResourceSelect(selected);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">Select media file...</option>
              {mediaResources.map((mediaResource) => (
                <option key={mediaResource.id} value={mediaResource.id}>
                  {getResourceDisplayName(mediaResource)}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
              No audio or video files found in this dataset
            </div>
          )}
        </div>

        {/* Audio/Video Element */}
        {selectedMediaResource && (
          <div className="mb-4">
            {selectedMediaResource.mimetype?.startsWith('audio/') && (
              <AudioPlayer
                audioRef={audioRef}
                selectedMediaResource={selectedMediaResource}
                onTimeUpdate={onTimeUpdate}
                onCanPlay={onCanPlay}
                onLoadedMetadata={onLoadedMetadata}
              />
            )}
            {selectedMediaResource.mimetype?.startsWith('video/') && (
              <VideoPlayer
                videoRef={videoRef}
                selectedMediaResource={selectedMediaResource}
                onTimeUpdate={onTimeUpdate}
                onCanPlay={onCanPlay}
                onLoadedMetadata={onLoadedMetadata}
              />
            )}
          </div>
        )}

        {!selectedMediaResource && mediaResources.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <FiMusic className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Select an audio or video file to start</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
