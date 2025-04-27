import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, User, Settings, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current && 
        !profileRef.current.contains(event.target as Node) &&
        notificationsRef.current && 
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Notifications dropdown */}
      <div className="relative" ref={notificationsRef}>
        <button
          onClick={toggleNotifications}
          className="p-1 text-gray-500 rounded-full hover:text-red-600 hover:bg-red-50 focus:outline-none"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
        
        {notificationsOpen && (
          <div className="absolute right-0 w-72 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-2">
              <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                Notifications
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 border-b hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-800">Task deadline approaching</p>
                  <p className="text-xs text-gray-500">Database Schema Design due in 3 days</p>
                </div>
                <div className="px-4 py-3 border-b hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-800">New meeting scheduled</p>
                  <p className="text-xs text-gray-500">Weekly Project Review tomorrow at 9:00 AM</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-800">Task status updated</p>
                  <p className="text-xs text-gray-500">Mobile App Prototype moved to Review</p>
                </div>
              </div>
              <div className="px-4 py-2 text-xs text-center text-red-600 border-t">
                <button className="hover:underline">View all notifications</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={toggleProfile}
          className="flex items-center space-x-2 focus:outline-none"
          aria-label="User menu"
        >
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-full border border-red-600"
          />
        </button>
        
        {profileOpen && (
          <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User size={16} className="mr-2" />
                Profile
              </Link>
              <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                <Settings size={16} className="mr-2" />
                Settings
              </div>
              <div className="border-t"></div>
              <div 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={logout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;