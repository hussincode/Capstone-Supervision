import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Users, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  User,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Teams', path: '/teams', icon: <Users size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Calendar', path: '/calendar', icon: <CalendarIcon size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-center h-16 bg-E63946 bg-red-600">
        <span className="text-xl font-bold text-white">Capstone Supervision</span>
      </div>
      
      <div className="flex flex-col flex-1 px-4 py-6 overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <img 
            src={user?.avatar} 
            alt={user?.name} 
            className="w-16 h-16 mb-2 rounded-full border-2 border-red-600"
          />
          <h2 className="text-lg font-medium text-gray-800">{user?.name}</h2>
          <span className="text-sm text-gray-500">{user?.role}</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 rounded-lg 
                ${isActive 
                  ? 'bg-red-50 text-red-600 font-medium' 
                  : 'hover:bg-red-50 hover:text-red-600'}`
              }
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="px-4 py-4 border-t">
        <button 
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;