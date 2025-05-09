import Layout from './app/_Layout/Layout';
import { AuthProvider } from './providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </QueryClientProvider>
  );
}
