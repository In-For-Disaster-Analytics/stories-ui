import Layout from './app/_Layout/Layout';
import { AuthProvider } from './providers/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
