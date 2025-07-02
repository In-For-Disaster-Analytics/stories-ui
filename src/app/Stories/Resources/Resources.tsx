import React from 'react';
import { StoryProvider } from '../StoryContext';
import { useParams } from 'react-router-dom';
import ResourcesList from '../../Pages/ResourcesList';

const Resources: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <StoryProvider id={id || ''}>
      <ResourcesList />
    </StoryProvider>
  );
};

export default Resources;
