import { Spinner } from '@nextui-org/react';
import { memo } from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export const LoadingSpinner = memo(({ fullScreen }: LoadingSpinnerProps) => {
  const containerClasses = fullScreen 
    ? "h-screen w-screen flex items-center justify-center" 
    : "h-40 flex items-center justify-center";

  return (
    <div className={containerClasses}>
      <Spinner size="lg" />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
