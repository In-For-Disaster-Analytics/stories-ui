import React from 'react';

type SubmitWrapperProps = React.PropsWithChildren<{
  isLoading: boolean;
  success: string | undefined;
  error: Error | null;
  className?: string;
  reverse?: boolean;
  hideLoading?: boolean;
  loadingMessage?: string;
  hideChildren?: boolean;
}>;

const SubmitWrapper: React.FC<SubmitWrapperProps> = ({
  isLoading,
  error,
  success,
  children,
  hideLoading,
  loadingMessage,
  hideChildren = false,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {!hideLoading && isLoading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}
      {error ? (
        <div className="text-center p-4">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      ) : (
        success && (
          <div className="text-center p-4">
            <p className="text-primary-500">{success}</p>
          </div>
        )
      )}
      {!hideChildren && children}
      {isLoading && loadingMessage && (
        <div className="text-center p-4">
          <p className="text-primary-500">{loadingMessage}</p>
        </div>
      )}
    </div>
  );
};

export default SubmitWrapper;
