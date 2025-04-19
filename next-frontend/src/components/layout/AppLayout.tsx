
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-automate-black text-white overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
