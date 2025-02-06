import React from 'react';

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingComponent;