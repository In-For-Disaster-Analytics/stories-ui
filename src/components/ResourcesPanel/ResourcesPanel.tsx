import React, { useState } from 'react';
import { FiChevronDown, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import './ResourcesPanel.css';
import { useStory } from '../../app/Stories/StoryContext';
import { useTranscribe } from '../../hooks/tapis/apps/useTranscribe';

const ResourcesPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const { resources } = useStory();

  const { transcribe, isLoading, error, jobResponse } = useTranscribe();

  const handlePreviewResource = (id: string) => {
    console.log(id);
  };

  const handleEmbedResource = (id: string) => {
    console.log(id);
  };

  const handleTranscribeResource = (url: string) => {
    transcribe({
      audioFileUrl: url,
    });
  };

  return (
    <div
      className={`resources-panel ${isExpanded ? 'expanded' : ''} ${isMaximized ? 'maximized' : ''}`}
    >
      <div className="resources-panel-header">
        <div className="resources-panel-title">
          <FiChevronDown className="w-5 h-5" />
          Existing Resources
          <span className="resources-count">{resources.length}</span>
        </div>
        <div className="resources-panel-actions">
          <button
            className="resources-panel-action"
            onClick={() => setIsMaximized(!isMaximized)}
            aria-label={isMaximized ? 'Minimize panel' : 'Maximize panel'}
          >
            {isMaximized ? (
              <FiMinimize2 className="w-4 h-4" />
            ) : (
              <FiMaximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            className="resources-panel-toggle"
            onClick={() => {
              setIsExpanded(!isExpanded);
              setIsMaximized(false);
            }}
            aria-label="Toggle resources panel"
          >
            <FiChevronDown
              className="w-4 h-4"
              style={{
                transform: !isExpanded ? 'rotate(180deg)' : '',
              }}
            />
          </button>
        </div>
      </div>
      <div className="resources-panel-content">
        <div className="resources-list">
          {resources.map((resource) => (
            <div key={resource.id} className="resource-card">
              <div className="resource-icon">
                <FiChevronDown className="w-8 h-8" />
              </div>
              <div className="resource-details">
                <div className="resource-name">{resource.name}</div>
                <div className="resource-meta">
                  <span>{resource.mimetype}</span>
                </div>
                <div className="resource-actions">
                  <button
                    className="resource-action"
                    onClick={() => handlePreviewResource(resource.id)}
                  >
                    Preview
                  </button>
                  <button
                    className="resource-action"
                    onClick={() => handleEmbedResource(resource.id)}
                  >
                    Embed
                  </button>
                  {resource.mimetype === 'audio/mpeg' && (
                    <button
                      className="resource-action"
                      onClick={() => handleTranscribeResource(resource.url)}
                    >
                      Transcribe
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPanel;
