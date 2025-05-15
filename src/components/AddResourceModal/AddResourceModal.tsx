import React, { useState } from 'react';
import {
  FiUpload,
  FiFile,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiLoader,
} from 'react-icons/fi';
import Modal from '../Modal/Modal';
import { useResourceManagement } from '../../hooks/useResourceManagement';
import { ResourceStatus } from '../../hooks/ckan/resources/useCreateMultipleResources';

interface AddResourceModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  isSubmitting?: boolean;
  error?: Error | null;
}

const FileStatusIcon: React.FC<{ status: ResourceStatus }> = ({ status }) => {
  switch (status) {
    case 'success':
      return <FiCheck className="h-5 w-5 text-green-500" />;
    case 'error':
      return <FiAlertCircle className="h-5 w-5 text-red-500" />;
    case 'pending':
      return <FiLoader className="h-5 w-5 text-blue-500 animate-spin" />;
    default:
      return null;
  }
};

const AddResourceModal: React.FC<AddResourceModalProps> = ({
  id,
  isOpen,
  onClose,
  isSubmitting = false,
  error = null,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { handleAddResource, getFileStatus } = useResourceManagement(id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(newFiles)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (files.length === 0) {
      newErrors.files = 'At least one file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await handleAddResource({ files });
        // Reset form
        setFiles([]);
        setErrors({});
        onClose();
      } catch (error) {
        // Error is handled by the parent component
        console.error('Error submitting form:', error);
      }
    }
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <button
        onClick={onClose}
        disabled={isSubmitting}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Adding...' : 'Add Resource'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Resource"
      size="lg"
      footer={footer}
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error.message || 'An error occurred while adding the resource'}
          </div>
        )}

        {/* File upload area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Drag and drop your files here, or{' '}
              <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                browse
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </label>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, DOC, XLS, CSV, JPG, PNG (Max 50MB)
            </p>
          </div>
        </div>

        {/* File preview list */}
        {errors.files && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {errors.files}
          </div>
        )}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => {
              const fileStatus = getFileStatus(file.name);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FiFile className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {fileStatus && (
                      <FileStatusIcon status={fileStatus.status} />
                    )}
                    {fileStatus?.error && (
                      <span className="text-xs text-red-500">
                        {fileStatus.error.message}
                      </span>
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddResourceModal;
