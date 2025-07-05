import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    
    // Check if token has 'exp' claim and compare with current time
    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    }
    
    // If no exp claim, consider token valid (fallback)
    return false;
  } catch (error) {
    console.error('Error decoding token:', error);
    // If token can't be decoded, consider it invalid/expired
    return true;
  }
};

const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        console.warn('Token has expired, logging out...');
        logout();
        return;
      }
      setAccessToken(token);
    }
  }, [logout]);

  // Periodic expiration check
  useEffect(() => {
    if (!accessToken) return;

    // Check token expiration every minute
    const interval = setInterval(() => {
      if (isTokenExpired(accessToken)) {
        console.warn('Token expired during session, logging out...');
        logout();
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [accessToken, logout]);

  return {
    accessToken,
  };
};

export default useAccessToken;
