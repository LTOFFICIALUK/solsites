'use client';

import React from 'react';
import { ProjectBlock } from '@/lib/services';

interface ComponentLibraryProps {
  blocks: ProjectBlock[];
  onBlockSelect: (block: ProjectBlock) => void;
  selectedBlock: ProjectBlock | null;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  blocks,
  onBlockSelect,
  selectedBlock
}) => {
  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'navbar':
        return '🧭';
      case 'hero':
        return '⭐';
      case 'about':
        return 'ℹ️';
      case 'footer':
        return '📄';
      default:
        return '📦';
    }
  };

  const getBlockDisplayName = (type: string) => {
    switch (type) {
      case 'navbar':
        return 'Navigation';
      case 'hero':
        return 'Hero Section';
      case 'about':
        return 'About';
      case 'footer':
        return 'Footer';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-2">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedBlock?.id === block.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onBlockSelect(block)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getBlockIcon(block.type)}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {getBlockDisplayName(block.type)}
                </div>
                <div className="text-sm text-gray-500">
                  {block.name}
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                block.is_enabled ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            </div>
          </div>
        ))}
      </div>
      
      {blocks.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">📦</div>
          <p>No components yet</p>
        </div>
      )}
    </div>
  );
};

export default ComponentLibrary;
