import React from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
type ProtectedRouteProps = {
  isAuthenticated: boolean;
  path: string;
  exact?: boolean;
};

const ProtectedRoute: React.FC<
  React.PropsWithChildren<ProtectedRouteProps>
> = ({ isAuthenticated, children, ...rest }) => {
  return (
    <Route
      {...rest}
      exact={rest.exact}
      render={({ location }: RouteComponentProps) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
