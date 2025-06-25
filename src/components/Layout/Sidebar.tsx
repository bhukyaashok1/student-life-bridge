
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  FileText, 
  Users, 
  BarChart3, 
  Bell, 
  MessageSquare, 
  Download, 
  BookOpen,
  GraduationCap,
  Settings,
  X
} from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

interface SidebarProps {
  onClose?: () => void;
}

const studentMenuItems = [
  { path: '/student/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/student/profile', label: 'Profile', icon: Users },
  { path: '/student/attendance', label: 'Attendance', icon: Calendar },
  { path: '/student/marks', label: 'Marks', icon: GraduationCap },
  { path: '/student/timetable', label: 'Timetable', icon: Calendar },
  { path: '/student/papers', label: 'Question Papers', icon: FileText },
  { path: '/student/notifications', label: 'Notifications', icon: Bell },
  { path: '/student/feedback', label: 'Feedback', icon: MessageSquare },
  { path: '/student/downloads', label: 'Downloads', icon: Download },
];

const adminMenuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/admin/students', label: 'Students', icon: Users },
  { path: '/admin/attendance', label: 'Attendance', icon: Calendar },
  { path: '/admin/marks', label: 'Marks', icon: GraduationCap },
  { path: '/admin/timetable', label: 'Timetable', icon: Calendar },
  { path: '/admin/papers', label: 'Question Papers', icon: FileText },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell },
  { path: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
  { path: '/admin/downloads', label: 'Downloads', icon: Download },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { userType } = useAuth();
  const isMobile = useIsMobile();
  const menuItems = userType === 'admin' ? adminMenuItems : studentMenuItems;

  return (
    <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-bold text-gray-800">SMS</span>
          </div>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
