import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NewStory from './NewStory';
import StoriesList from '../Pages/StoriesList';
import SingleStoryRouter from './SingleStoryRouter';

const StoriesRouter: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/stories/new">
        <NewStory />
      </Route>
      <Route exact path="/stories">
        <StoriesList />
      </Route>
      <Route path="/stories/:id">
        <SingleStoryRouter />
      </Route>
    </Switch>
  );
};

export default StoriesRouter;
