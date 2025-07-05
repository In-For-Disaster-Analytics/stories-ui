import React from 'react';
import { useParams } from 'react-router-dom';
import AddResourceModal from '../../components/AddResourceModal/AddResourceModal';
import Footer from './_components/Footer';
import Editor from './_components/Editor';
import Header from './_components/Header';
import { useStory } from './StoryContext';
import QueryWrapper from '../common/QueryWrapper/QueryWrapper';

const StoryContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDatasetLoading, isNotesLoading } = useStory();

  return (
    <QueryWrapper isLoading={isDatasetLoading || isNotesLoading} error={null}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <Editor />
        <Footer />
        <AddResourceModal id={id} />
      </div>
    </QueryWrapper>
  );
};

const Story: React.FC = () => {
  return <StoryContent />;
};

export default Story;
