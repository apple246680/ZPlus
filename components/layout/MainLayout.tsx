
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { APP_TITLE } from '../../constants';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-zyberion-blue text-zyberion-light-gray overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-zyberion-light-blue shadow-md p-4 border-b border-zyberion-dark-gray">
          <h1 className="text-xl font-semibold text-white">{APP_TITLE}</h1>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zyberion-blue p-6 pb-12"> {/* Added pb-12 for status bar */}
          <Outlet /> {/* Content for the current route will be rendered here */}
        </main>
        <StatusBar />
      </div>
    </div>
  );
};
    