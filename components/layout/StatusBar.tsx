
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

export const StatusBar: React.FC = () => {
  const { currentUser } = useAppContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zyberion-dark-gray text-zyberion-gray px-4 py-2 text-xs border-t border-black/20 shadow-md">
      Logon: {currentUser ? currentUser.username : 'Anonymous'}
    </div>
  );
};
    