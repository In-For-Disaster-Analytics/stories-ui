import React from 'react';
import { StoryProvider } from '../StoryContext';
import { useParams } from 'react-router-dom';
import TableList from './_components/TableList';

const Resources: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <StoryProvider id={id || ''}>
      <TableList />
    </StoryProvider>
  );
};

export default Resources;
