import React from 'react';
import Loading from '../Loading/Loading';

interface QueryWrapperProps {
  isLoading: boolean;
  loadingMessage?: string;
  error: Error | null;
  children: React.ReactNode;
}

const QueryWrapper: React.FC<QueryWrapperProps> = ({
  isLoading,
  loadingMessage = 'Loading...',
  error,
  children,
}) => {
  if (isLoading && !error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loading loadingMessage={loadingMessage} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default QueryWrapper;
