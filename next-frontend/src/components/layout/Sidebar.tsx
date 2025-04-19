
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  UserCircle
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  collapsed?: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, label, shortcut, collapsed, onClick }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === to;
  
  return (
    <Link
      href={to}
      className={`flex items-center px-4 py-3 mb-1 rounded-md automate-transition
         ${isActive ? 'bg-automate-purple text-white' : 'text-gray-300 hover:bg-automate-dark-gray'}`}
      onClick={onClick}
    >
      <Icon size={20} className="min-w-5" />
      {!collapsed && (
        <>
          <span className="ml-3 flex-1">{label}</span>
          {shortcut && <span className="text-xs text-gray-400">{shortcut}</span>}
        </>
      )}
    </Link>
  );
};

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar = ({ collapsed, toggleCollapse }: SidebarProps) => {
  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-automate-black border-r border-gray-800 flex flex-col automate-transition`}>
      <div className="p-4 flex items-center">
        {!collapsed ? (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-automate-purple flex items-center justify-center">
              <span className="font-bold text-white">AP</span>
            </div>
            <h1 className="ml-2 font-bold text-xl automate-gradient-text">AutoMate Pro</h1>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-md bg-automate-purple flex items-center justify-center mx-auto">
            <span className="font-bold text-white">AP</span>
          </div>
        )}
      </div>
      
      <div className="mt-6 px-2 flex-1 overflow-auto">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" shortcut="Alt+D" collapsed={collapsed} />
        <NavItem to="/jobs" icon={Briefcase} label="Jobs" shortcut="Alt+J" collapsed={collapsed} />
        <NavItem to="/profile" icon={UserCircle} label="Profile" shortcut="Alt+P" collapsed={collapsed} />
        <NavItem to="/settings" icon={Settings} label="Settings" shortcut="Alt+C" collapsed={collapsed} />
      </div>

      {/* Collapse Button */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={toggleCollapse} 
          className="w-full flex items-center justify-center p-2 text-gray-400 hover:bg-automate-dark-gray rounded-md automate-transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
