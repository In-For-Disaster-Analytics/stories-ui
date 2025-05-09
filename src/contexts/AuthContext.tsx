import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import login from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // You might want to add an API call here to validate the token
          // For now, we'll just check if it exists
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error checking authentication:', error);
          localStorage.removeItem('access_token');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const basePath = import.meta.env.VITE_TAPIS_API_BASE_URL || '';
      const response = await login(email, password, basePath);

      if (
        response.result?.access_token &&
        response.result.access_token.access_token
      ) {
        localStorage.setItem(
          'access_token',
          response.result.access_token.access_token,
        );
        setIsAuthenticated(true);
      } else {
        throw new Error('No access token received');
      }
    } catch (err) {
      let errorMessage = 'Invalid username or password';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Try to extract error message from API response
        interface ApiError {
          body?: {
            detail?: string;
            message?: string;
          };
          status?: number;
        }
        const apiError = err as ApiError;

        if (apiError.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (apiError.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (apiError.body && typeof apiError.body === 'object') {
          errorMessage =
            apiError.body.detail || apiError.body.message || errorMessage;
        }
      }
      setError(new Error(errorMessage));
      console.error('Error during login:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        error,
        login: handleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
