import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../common/ProtectedRoute';
import Login from '../Login/Login';
import { useAuth } from '../../contexts/AuthContext';
import { Loading } from '../common/Loading';
import StoriesRouter from '../Stories/_Router';
import StoriesList from '../Pages/StoriesList';


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
        <StoriesList />
      </ProtectedRoute>
      <ProtectedRoute isAuthenticated={isAuthenticated} path="/stories">
        <StoriesRouter />
      </ProtectedRoute>
    </Switch>
  );
};

export default Router;
