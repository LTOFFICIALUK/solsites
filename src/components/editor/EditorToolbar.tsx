'use client';

import React from 'react';

interface EditorToolbarProps {
  previewMode: 'desktop' | 'tablet' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  onRefreshPreview?: () => void;
  onOpenPreview?: () => void;
  isSaving?: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  previewMode,
  onPreviewModeChange,
  onRefreshPreview,
  onOpenPreview,
  isSaving = false
}) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Preview Mode Toggle */}
      <div className="flex items-center bg-gray-100 rounded-md p-1">
        <button
          onClick={() => onPreviewModeChange('desktop')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            previewMode === 'desktop'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Desktop
        </button>
        <button
          onClick={() => onPreviewModeChange('tablet')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            previewMode === 'tablet'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Tablet
        </button>
        <button
          onClick={() => onPreviewModeChange('mobile')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            previewMode === 'mobile'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Mobile
        </button>
      </div>

      {/* Refresh Preview Button */}
      {onRefreshPreview && (
        <button 
          onClick={onRefreshPreview}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm flex items-center space-x-1"
          title="Refresh Preview"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      )}

      {/* Preview Button */}
      <button 
        onClick={onOpenPreview}
        disabled={isSaving}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center space-x-1"
        title={isSaving ? "Saving..." : "Open Preview in New Tab"}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <span>{isSaving ? "Saving..." : "Preview"}</span>
      </button>
    </div>
  );
};

export default EditorToolbar;
