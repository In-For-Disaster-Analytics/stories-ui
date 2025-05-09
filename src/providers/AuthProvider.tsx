import React from 'react';
import { AuthProvider as BaseAuthProvider } from '../contexts/AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return <BaseAuthProvider>{children}</BaseAuthProvider>;
};
