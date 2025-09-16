// src/components/ui/NoticeCardSkeleton.jsx
import React from 'react';

const NoticeCardSkeleton = () => {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white border border-gray-200">
      <div className="animate-pulse flex flex-col h-full">
        <div className="flex items-start mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
          <div className="flex-grow">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default NoticeCardSkeleton;