import React, { useState } from 'react';
import {
  FiChevronDown,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiCode,
  FiMic,
} from 'react-icons/fi';
import { useStory } from '../../Stories/StoryContext';
import TranscriptionModal from '../../../components/TranscriptionModal/TranscriptionModal';
import { Resource } from '../../../types/resource';

interface ResourcesListProps {
  title?: string;
  showHeader?: boolean;
}

const ResourcesList: React.FC<ResourcesListProps> = ({
  title = 'Resources',
  showHeader = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMimeType, setSelectedMimeType] = useState<string>('all');
  const [isTranscriptionModalOpen, setIsTranscriptionModalOpen] =
    useState(false);
  const [
    selectedResourceForTranscription,
    setSelectedResourceForTranscription,
  ] = useState<Resource | null>(null);
  const { resources } = useStory();

  // Filter resources based on search query and mime type
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMimeType =
      selectedMimeType === 'all' || resource.mimetype === selectedMimeType;
    return matchesSearch && matchesMimeType;
  });

  // Get unique mime types for filter dropdown
  const mimeTypes = [
    'all',
    ...Array.from(new Set(resources.map((r) => r.mimetype))),
  ];

  const handlePreviewResource = (id: string) => {
    console.log('Preview resource:', id);
    // TODO: Implement preview functionality
  };

  const handleEmbedResource = (id: string) => {
    console.log('Embed resource:', id);
    // TODO: Implement embed functionality
  };

  const handleTranscribeResource = (resource: Resource) => {
    setSelectedResourceForTranscription(resource);
    setIsTranscriptionModalOpen(true);
  };

  const handleCloseTranscriptionModal = () => {
    setIsTranscriptionModalOpen(false);
    setSelectedResourceForTranscription(null);
  };

  const handleDownloadResource = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getResourceIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return '🖼️';
    if (mimetype.startsWith('video/')) return '🎥';
    if (mimetype.startsWith('audio/')) return '🎵';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('json') || mimetype.includes('xml')) return '📊';
    if (mimetype.includes('csv') || mimetype.includes('excel')) return '📈';
    return '📎';
  };

  const getMimeTypeDisplayName = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return 'Images';
    if (mimetype.startsWith('video/')) return 'Videos';
    if (mimetype.startsWith('audio/')) return 'Audio';
    if (mimetype.includes('pdf')) return 'PDFs';
    if (mimetype.includes('json') || mimetype.includes('xml'))
      return 'Data Files';
    if (mimetype.includes('csv') || mimetype.includes('excel'))
      return 'Spreadsheets';
    return 'Other Files';
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        {showHeader && (
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                  <p className="mt-2 text-gray-600">
                    {resources.length} resource
                    {resources.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter by Mime Type */}
              <div className="sm:w-48">
                <div className="relative">
                  <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedMimeType}
                    onChange={(e) => setSelectedMimeType(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    {mimeTypes.map((mimeType) => (
                      <option key={mimeType} value={mimeType}>
                        {mimeType === 'all'
                          ? 'All Types'
                          : getMimeTypeDisplayName(mimeType)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Resources List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resources ({filteredResources.length})
                </h2>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FiChevronDown
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="divide-y divide-gray-200">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Resource Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                            {getResourceIcon(resource.mimetype)}
                          </div>
                        </div>

                        {/* Resource Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 truncate">
                                {resource.name}
                              </h3>
                              {resource.description && (
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                  {resource.description}
                                </p>
                              )}
                              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {resource.mimetype}
                                </span>
                                {resource.size && (
                                  <span>
                                    {(resource.size / 1024 / 1024).toFixed(2)}{' '}
                                    MB
                                  </span>
                                )}
                                {resource.created && (
                                  <span>
                                    {new Date(
                                      resource.created,
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Resource Actions */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              onClick={() => handlePreviewResource(resource.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiEye className="w-3 h-3 mr-1" />
                              Preview
                            </button>

                            <button
                              onClick={() => handleEmbedResource(resource.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiCode className="w-3 h-3 mr-1" />
                              Embed
                            </button>

                            {(resource.mimetype.startsWith('audio/') ||
                              resource.mimetype.startsWith('video/')) && (
                              <button
                                onClick={() =>
                                  handleTranscribeResource(resource)
                                }
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <FiMic className="w-3 h-3 mr-1" />
                                Transcribe
                              </button>
                            )}

                            <button
                              onClick={() =>
                                handleDownloadResource(
                                  resource.url,
                                  resource.name,
                                )
                              }
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiDownload className="w-3 h-3 mr-1" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📎</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No resources found
                    </h3>
                    <p className="text-gray-600">
                      {searchQuery || selectedMimeType !== 'all'
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No resources are available at the moment.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Transcription Modal */}
        <TranscriptionModal
          isOpen={isTranscriptionModalOpen}
          onClose={handleCloseTranscriptionModal}
          resource={selectedResourceForTranscription}
        />
      </div>
    </div>
  );
};

export default ResourcesList;
