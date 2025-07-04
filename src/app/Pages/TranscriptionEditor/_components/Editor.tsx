import React from 'react';
import { FiPlus, FiTrash2, FiScissors } from 'react-icons/fi';
import {
  TranscriptionSegment,
  TranscriptionEditorConfig,
} from '../../../../types/transcription';

interface EditorProps {
  segments: TranscriptionSegment[];
  config: TranscriptionEditorConfig;
  currentTime: number;
  onUpdateSegment: (
    index: number,
    field: keyof TranscriptionSegment,
    value: string | [number, number],
  ) => void;
  onAddSegment: (afterIndex: number) => void;
  onDeleteSegment: (index: number) => void;
  onSplitSegment: (index: number) => void;
  onTimestampClick: (time: number) => void;
}

const Editor: React.FC<EditorProps> = ({
  segments,
  config,
  currentTime,
  onUpdateSegment,
  onAddSegment,
  onDeleteSegment,
  onSplitSegment,
  onTimestampClick,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCPS = (text: string, duration: number): number => {
    return duration > 0 ? text.length / duration : 0;
  };

  const isSegmentPlaying = (segment: TranscriptionSegment): boolean => {
    return (
      currentTime >= segment.timestamp[0] && currentTime <= segment.timestamp[1]
    );
  };

  return (
    <div className="lg:col-span-3">
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
                <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Speaker
                </th>
                <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start
                </th>
                <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                const isPlaying = isSegmentPlaying(segment);

                return (
                  <tr 
                    key={index} 
                    className={`hover:bg-gray-50 ${
                      isPlaying 
                        ? 'bg-blue-50 border-l-4 border-blue-400' 
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onAddSegment(index)}
                          className="text-green-600 hover:text-green-900"
                          title="Add segment"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSplitSegment(index)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Split segment"
                        >
                          <FiScissors className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteSegment(index)}
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
                        onChange={(e) =>
                          onUpdateSegment(index, 'speaker', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onTimestampClick(segment.timestamp[0])}
                        className="text-blue-600 hover:text-blue-900 text-sm font-mono"
                      >
                        {formatTime(segment.timestamp[0])}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onTimestampClick(segment.timestamp[1])}
                        className="text-blue-600 hover:text-blue-900 text-sm font-mono"
                      >
                        {formatTime(segment.timestamp[1])}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <textarea
                        value={segment.text}
                        onChange={(e) =>
                          onUpdateSegment(index, 'text', e.target.value)
                        }
                        className={`w-full px-2 py-1 border rounded text-sm resize-y ${
                          isHighCPS
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300'
                        }`}
                        rows={4}
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
  );
};

export default Editor;
