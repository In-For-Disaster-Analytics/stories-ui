import React from 'react';

type LoadingProps = React.PropsWithChildren<{
  loadingMessage?: string;
}>;

const Loading: React.FC<LoadingProps> = ({ loadingMessage }) => {
  return (
    <div className="flex flex-col gap-4">
      {loadingMessage && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}
      {loadingMessage && (
        <div className="text-center p-4">
          <p className="text-primary-500">{loadingMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Loading;
