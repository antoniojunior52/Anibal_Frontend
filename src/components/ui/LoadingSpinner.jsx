import React from 'react';

const LoadingSpinner = ({ message = "Carregando...", size = "md" }) => {
  let spinnerSizeClass = 'h-8 w-8';
  let textSizeClass = 'text-base';

  switch (size) {
    case 'sm':
      spinnerSizeClass = 'h-6 w-6';
      textSizeClass = 'text-sm';
      break;
    case 'lg':
      spinnerSizeClass = 'h-12 w-12';
      textSizeClass = 'text-lg';
      break;
    case 'xl':
      spinnerSizeClass = 'h-16 w-16';
      textSizeClass = 'text-xl';
      break;
    default: // md
      spinnerSizeClass = 'h-8 w-8';
      textSizeClass = 'text-base';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4" role="status" aria-live="polite">
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-500 ${spinnerSizeClass}`}
        aria-hidden="true"
      >
        <span className="sr-only">Carregando...</span>
      </div>
      {message && (
        <p className={`mt-3 text-gray-600 ${textSizeClass}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;