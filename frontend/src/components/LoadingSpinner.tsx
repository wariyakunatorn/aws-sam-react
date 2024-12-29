import { memo } from 'react';
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export const LoadingSpinner = memo(({ fullScreen }: LoadingSpinnerProps) => {
  const containerClasses = cn(
    "flex items-center justify-center",
    fullScreen ? "h-screen w-screen" : "h-40"
  );

  return (
    <div className={containerClasses}>
      <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
