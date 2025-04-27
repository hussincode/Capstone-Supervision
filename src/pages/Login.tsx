import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Briefcase, User, Users } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    if (selectedRole) {
      setIsLoggingIn(true);
      setTimeout(() => {
        login(selectedRole);
      }, 1000); // Simulate login delay
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const roleOptions: { role: UserRole; icon: JSX.Element; description: string }[] = [
    {
      role: 'Manager',
      icon: <Briefcase size={30} />,
      description: 'Oversee all projects and teams'
    },
    {
      role: 'Leader',
      icon: <Users size={30} />,
      description: 'Manage specific project teams'
    },
    {
      role: 'Team Leader',
      icon: <User size={30} />,
      description: 'Lead individual project teams'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-red-600">Capstone Supervision</h1>
            <p className="mt-2 text-gray-600">Login to your account</p>
          </motion.div>
        </div>
        
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Role</label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {roleOptions.map((option) => (
              <motion.div
                key={option.role}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedRole === option.role
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                }`}
                onClick={() => setSelectedRole(option.role)}
              >
                <div className={`p-2 rounded-full mb-2 ${
                  selectedRole === option.role ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {option.icon}
                </div>
                <span className={`font-medium ${
                  selectedRole === option.role ? 'text-red-600' : 'text-gray-700'
                }`}>
                  {option.role}
                </span>
                <span className="text-xs text-center text-gray-500 mt-1">{option.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 mt-8 text-white font-medium rounded-lg transition-all ${
            selectedRole
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleLogin}
          disabled={!selectedRole || isLoggingIn}
        >
          {isLoggingIn ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </div>
          ) : (
            'Login'
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default Login;