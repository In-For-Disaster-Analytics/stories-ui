import { useState, useEffect } from 'react';

const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token'));
  }, []);

  return {
    accessToken,
  };
};

export default useAccessToken;
