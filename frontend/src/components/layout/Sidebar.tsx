
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  FileText, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight,
  UserCircle
} from 'lucide-react';
import ProfileSection from './ProfileSection';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  collapsed?: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, label, shortcut, collapsed, onClick }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 mb-1 rounded-md automate-transition
         ${isActive ? 'bg-automate-purple text-white' : 'text-gray-300 hover:bg-automate-dark-gray'}`
      }
      onClick={onClick}
    >
      <Icon size={20} className="min-w-5" />
      {!collapsed && (
        <>
          <span className="ml-3 flex-1">{label}</span>
          {shortcut && <span className="text-xs text-gray-400">{shortcut}</span>}
        </>
      )}
    </NavLink>
  );
};

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  showProfile: boolean;
  toggleProfile: () => void;
}

const Sidebar = ({ collapsed, toggleCollapse, showProfile, toggleProfile }: SidebarProps) => {
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
      
      {/* Profile Button */}
      {!showProfile && (
        <div className="px-2 mt-2 mb-4">
          <button 
            onClick={toggleProfile} 
            className="w-full flex items-center px-4 py-3 rounded-md text-gray-300 hover:bg-automate-dark-gray automate-transition"
          >
            <UserCircle size={20} />
            {!collapsed && <span className="ml-3">Profile</span>}
          </button>
        </div>
      )}

      {/* Profile Section or Navigation */}
      {showProfile ? (
        <div className={`flex-1 overflow-auto ${collapsed ? 'hidden' : 'block'}`}>
          <div className="px-2 mb-2">
            <button 
              onClick={toggleProfile} 
              className="w-full text-left px-4 py-2 rounded-md text-gray-400 hover:bg-automate-dark-gray automate-transition"
            >
              ← Back to Navigation
            </button>
          </div>
          <ProfileSection />
        </div> 
      ) : (
        <div className="mt-6 px-2 flex-1 overflow-auto">
          <NavItem to="/Dashboard" icon={LayoutDashboard} label="Dashboard" shortcut="Alt+D" collapsed={collapsed} />
          <NavItem to="/jobs" icon={Briefcase} label="Jobs" shortcut="Alt+J" collapsed={collapsed} />
          <NavItem to="/schedules" icon={Calendar} label="Schedules" shortcut="Alt+S" collapsed={collapsed} />
          <NavItem to="/logs" icon={FileText} label="Logs" shortcut="Alt+L" collapsed={collapsed} />
          <NavItem to="/settings" icon={Settings} label="Settings" shortcut="Alt+C" collapsed={collapsed} />
          <NavItem to="/help" icon={HelpCircle} label="Help" shortcut="Alt+H" collapsed={collapsed} />
        </div>
      )}

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
