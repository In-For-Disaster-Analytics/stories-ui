import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiSave, FiX } from 'react-icons/fi';
import Modal from '../../../../components/Modal/Modal';
import { TranscriptionSegment } from '../../../../types/transcription';

interface AnnotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  segment: TranscriptionSegment | null;
  onSave: (annotation: string) => void;
}

const AnnotationModal: React.FC<AnnotationModalProps> = ({
  isOpen,
  onClose,
  segment,
  onSave,
}) => {
  const [annotation, setAnnotation] = useState('');

  useEffect(() => {
    if (segment) {
      setAnnotation(segment.annotation || '');
    }
  }, [segment]);

  const handleSave = () => {
    onSave(annotation.trim());
    onClose();
  };

  const handleCancel = () => {
    setAnnotation(segment?.annotation || '');
    onClose();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!segment) return null;

  const footer = (
    <div className="flex justify-end space-x-3">
      <button
        onClick={handleCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FiX className="w-4 h-4 mr-2 inline" />
        Cancel
      </button>
      <button
        onClick={handleSave}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FiSave className="w-4 h-4 mr-2 inline" />
        Save Annotation
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Add Annotation"
      size="lg"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Segment Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FiMessageSquare className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Segment Details</h3>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="font-medium">{segment.speaker}</span>
              <span>
                {formatTime(segment.timestamp[0])} - {formatTime(segment.timestamp[1])}
              </span>
            </div>
          </div>
          
          {/* Read-only segment text */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Segment Text (Read-only)
            </label>
            <div className="w-full p-3 bg-white border border-gray-300 rounded-md text-sm text-gray-900 min-h-[100px] overflow-y-auto">
              {segment.text}
            </div>
          </div>
        </div>

        {/* Annotation Input */}
        <div>
          <label htmlFor="annotation" className="block text-sm font-medium text-gray-700 mb-2">
            Annotation
          </label>
          <textarea
            id="annotation"
            value={annotation}
            onChange={(e) => setAnnotation(e.target.value)}
            placeholder="Add your annotation for this segment..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-y"
            rows={6}
          />
          <p className="mt-2 text-sm text-gray-500">
            Add notes, observations, or any relevant information about this transcription segment.
          </p>
        </div>

        {/* Character count */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{annotation.length} characters</span>
          {segment.annotation && annotation !== segment.annotation && (
            <span className="text-orange-600 font-medium">* Unsaved changes</span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AnnotationModal;