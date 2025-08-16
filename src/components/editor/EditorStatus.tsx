'use client';

import React from 'react';

interface EditorStatusProps {
  isSaving: boolean;
}

const EditorStatus: React.FC<EditorStatusProps> = ({ isSaving }) => {
  return (
    <div className="flex items-center space-x-2">
      {isSaving ? (
        <>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Saving...</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Saved</span>
        </>
      )}
    </div>
  );
};

export default EditorStatus;


