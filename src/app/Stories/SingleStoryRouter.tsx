import React from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { StoryProvider } from './StoryContext';
import Story from './Story';
import Resources from './Resources/Resources';
import TranscriptionEditor from '../Pages/TranscriptionEditor';

const SingleStoryRouter: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <StoryProvider id={id}>
      <Switch>
        <Route exact path="/stories/:id">
          <Story />
        </Route>
        <Route exact path="/stories/:id/resources/:resourceId/transcriptionEditor">
          <TranscriptionEditor />
        </Route>
        <Route path="/stories/:id/resources">
          <Resources />
        </Route>
      </Switch>
    </StoryProvider>
  );
};

export default SingleStoryRouter;