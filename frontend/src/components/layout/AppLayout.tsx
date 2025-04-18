
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ProfileSection from './ProfileSection';
import { Outlet } from 'react-router-dom';

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex h-screen w-full bg-automate-black text-white overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        showProfile={showProfile}
        toggleProfile={() => setShowProfile(!showProfile)}
      />
      <main className="flex-1 overflow-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AppLayout;
