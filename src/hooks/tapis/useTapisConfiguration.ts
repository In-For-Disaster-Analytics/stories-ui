import { Configuration } from '@tapis/tapis-typescript-jobs';

export const useTapisConfiguration = () => {
  const configuration = new Configuration({
    basePath: import.meta.env.VITE_TAPIS_API_BASE_URL,
    headers: {
      'X-Tapis-Token': localStorage.getItem('access_token') || '',
    },
  });

  return configuration;
};
