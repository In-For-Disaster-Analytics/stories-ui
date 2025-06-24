import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Story from './Story';
import Resources from './Resources/Resources';
import NewStory from './NewStory';
import StoriesList from '../Pages/StoriesList';

const StoriesRouter: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/stories/new">
        <NewStory />
      </Route>
      <Route exact path="/stories">
        <StoriesList />
      </Route>
      <Route exact path="/stories/:id">
        <Story />
      </Route>
      <Route path="/stories/:id/resources">
        <Resources />
      </Route>
    </Switch>
  );
};

export default StoriesRouter;
