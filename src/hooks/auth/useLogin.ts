import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err) {
      // Error is already handled in the AuthContext
      console.error('Login failed:', err);
    }
  };

  return {
    login: handleLogin,
    setEmail,
    setPassword,
    email,
    password,
    isLoading,
    error,
  };
};

export default useLogin;
