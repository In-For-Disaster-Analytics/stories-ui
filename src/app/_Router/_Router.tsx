import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import ProtectedRoute from '../common/ProtectedRoute';
import Login from '../Login/Login';
import NewStory from '../Stories/NewStory';
import { useAuth } from '../../contexts/AuthContext';
import { Loading } from '../common/Loading';
import Story from '../Stories/Story';

const Router: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Switch>
      <Route exact path="/login">
        <Login />
      </Route>
      <ProtectedRoute isAuthenticated={isAuthenticated} exact path="/">
        <Home />
      </ProtectedRoute>
      <ProtectedRoute isAuthenticated={isAuthenticated} path="/stories/:id">
        <Story />
      </ProtectedRoute>
      <ProtectedRoute
        isAuthenticated={isAuthenticated}
        exact
        path="/stories/new"
      >
        <NewStory />
      </ProtectedRoute>
    </Switch>
  );
};

export default Router;
