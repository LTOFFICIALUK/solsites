'use client';

import React from 'react';

interface DevicePreviewProps {
  children: React.ReactNode;
  mode: 'desktop' | 'tablet' | 'mobile';
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ children, mode }) => {
  const getDeviceStyles = () => {
    switch (mode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      case 'desktop':
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className={`${getDeviceStyles()} bg-white rounded-lg shadow-lg overflow-hidden`}>
      {children}
    </div>
  );
};

export default DevicePreview;
