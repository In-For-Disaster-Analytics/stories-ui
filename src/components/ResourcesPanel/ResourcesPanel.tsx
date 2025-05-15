import React, { useState } from 'react';
import { FiPlus, FiChevronDown } from 'react-icons/fi';
import './ResourcesPanel.css';

interface Resource {
  id: string;
  name: string;
  type: string;
  size: string;
}

interface ResourcesPanelProps {
  resources: Resource[];
  onAddResource: () => void;
  onPreviewResource: (id: string) => void;
  onEmbedResource: (id: string) => void;
}

const ResourcesPanel: React.FC<ResourcesPanelProps> = ({
  resources,
  onAddResource,
  onPreviewResource,
  onEmbedResource,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(e.currentTarget.offsetHeight);
    document.body.style.cursor = 'ns-resize';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const deltaY = startY - e.clientY;
    const newHeight = Math.min(
      Math.max(startHeight + deltaY, 50),
      window.innerHeight * 0.8,
    );
    const panel = document.querySelector('.resources-panel') as HTMLElement;
    if (panel) {
      panel.style.height = `${newHeight}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = '';
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={`resources-panel ${isExpanded ? 'expanded' : ''}`}>
      <div className="resources-panel-header" onMouseDown={handleMouseDown}>
        <div className="resources-panel-title">
          <FiChevronDown className="w-5 h-5" />
          Resources
          <span className="resources-count">{resources.length}</span>
        </div>
        <div className="resources-panel-actions">
          <button
            className="add-resource-floating-button"
            onClick={onAddResource}
            title="Add Resource"
          >
            <FiPlus className="w-4 h-4" />
          </button>
          <button
            className="resources-panel-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Toggle resources panel"
          >
            <FiChevronDown
              className="w-4 h-4"
              style={{
                transform: isExpanded ? 'rotate(180deg)' : '',
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
                  <span>{resource.type}</span>
                  <span>{resource.size}</span>
                </div>
                <div className="resource-actions">
                  <button
                    className="resource-action"
                    onClick={() => onPreviewResource(resource.id)}
                  >
                    Preview
                  </button>
                  <button
                    className="resource-action"
                    onClick={() => onEmbedResource(resource.id)}
                  >
                    Embed
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="add-resource-button" onClick={onAddResource}>
          <FiPlus className="w-4 h-4" />
          Add Resource
        </button>
      </div>
    </div>
  );
};

export default ResourcesPanel;
