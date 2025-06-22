
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Bell, User, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { profile, userType, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          College Management System
        </h1>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium">
              {profile?.full_name} ({userType})
            </span>
          </div>
          
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};
