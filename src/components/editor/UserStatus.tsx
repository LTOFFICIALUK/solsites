'use client';

import React from 'react';

interface UserStatusProps {
  user: any;
}

const UserStatus: React.FC<UserStatusProps> = ({ user }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </span>
      </div>
      <span className="text-sm text-gray-700">
        {user?.email || 'User'}
      </span>
    </div>
  );
};

export default UserStatus;


