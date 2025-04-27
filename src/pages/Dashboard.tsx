import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  BarChart3, 
  Users, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, teams, meetings } = useData();
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    review: 0
  });

  useEffect(() => {
    setTaskStats({
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      pending: tasks.filter(task => task.status === 'pending').length,
      review: tasks.filter(task => task.status === 'review').length
    });
  }, [tasks]);

  // Sort meetings by date to find upcoming ones
  const upcomingMeetings = [...meetings]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter(meeting => new Date(`${meeting.date}T${meeting.startTime}`) > new Date())
    .slice(0, 3);

  // Get recent tasks
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <motion.div 
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Welcome card */}
      <motion.div 
        className="col-span-1 lg:col-span-3"
        variants={item}
      >
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.name}!</h2>
              <p className="text-red-100">Here's what's happening with your capstone project supervision today.</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-red-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats overview */}
      <motion.div 
        className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={item}
      >
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{taskStats.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}></div>
            </div>
            <span className="ml-2 text-gray-500 font-medium">{Math.round((taskStats.completed / taskStats.total) * 100) || 0}%</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <PieChart size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Task Status</p>
              <div className="flex space-x-2 mt-1">
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{taskStats.completed} Done</span>
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">{taskStats.pending} Pending</span>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-1">
            <div className="bg-green-500 h-1 rounded-l" style={{ width: '100%' }}></div>
            <div className="bg-blue-500 h-1" style={{ width: '100%' }}></div>
            <div className="bg-yellow-500 h-1" style={{ width: '100%' }}></div>
            <div className="bg-purple-500 h-1 rounded-r" style={{ width: '100%' }}></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Teams</p>
              <p className="text-2xl font-bold text-gray-800">{teams.length}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <div className="flex justify-between items-center">
              <span>Active Teams</span>
              <span className="font-medium text-gray-800">{teams.length}</span>
            </div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <CalendarIcon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Upcoming Meetings</p>
              <p className="text-2xl font-bold text-gray-800">{upcomingMeetings.length}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {upcomingMeetings.length > 0 ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center text-red-600">
                  <Clock size={16} className="mr-1" />
                  <span>Next: {formatDate(upcomingMeetings[0].date)}</span>
                </div>
                <span className="font-medium text-gray-800">{upcomingMeetings[0].startTime}</span>
              </div>
            ) : (
              <span>No upcoming meetings</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Task Performance */}
      <motion.div 
        className="col-span-1 lg:col-span-2"
        variants={item}
      >
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              <div className="flex items-center">
                <BarChart3 size={18} className="mr-2 text-red-600" />
                Task Performance
              </div>
            </h3>
            <Link to="/tasks" className="text-sm text-red-600 hover:underline flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-700 font-medium">Completed</span>
                <span className="text-gray-500">{Math.round((taskStats.completed / taskStats.total) * 100) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-700 font-medium">In Progress</span>
                <span className="text-gray-500">{Math.round((taskStats.inProgress / taskStats.total) * 100) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(taskStats.inProgress / taskStats.total) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-700 font-medium">Pending</span>
                <span className="text-gray-500">{Math.round((taskStats.pending / taskStats.total) * 100) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(taskStats.pending / taskStats.total) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-700 font-medium">Review</span>
                <span className="text-gray-500">{Math.round((taskStats.review / taskStats.total) * 100) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(taskStats.review / taskStats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Tasks */}
      <motion.div 
        className="col-span-1"
        variants={item}
      >
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              <div className="flex items-center">
                <CheckSquare size={18} className="mr-2 text-red-600" />
                Recent Tasks
              </div>
            </h3>
            <Link to="/tasks" className="text-sm text-red-600 hover:underline flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentTasks.map(task => (
              <div key={task.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-800 font-medium">{task.title}</h4>
                    <p className="text-gray-500 text-sm mt-1">{task.description.substring(0, 60)}...</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTaskStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                  <span>Team: {teams.find(team => team.id === task.assignedTo)?.name || 'Unknown'}</span>
                  <span>Due: {formatDate(task.deadline)}</span>
                </div>
              </div>
            ))}
            {recentTasks.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No tasks found
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Upcoming Meetings */}
      <motion.div 
        className="col-span-1 lg:col-span-2"
        variants={item}
      >
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              <div className="flex items-center">
                <CalendarIcon size={18} className="mr-2 text-red-600" />
                Upcoming Meetings
              </div>
            </h3>
            <Link to="/calendar" className="text-sm text-red-600 hover:underline flex items-center">
              View Calendar <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex">
                  <div className="mr-4 text-center">
                    <div className="bg-red-50 text-red-600 rounded-lg p-3 w-16">
                      <div className="text-xs uppercase font-bold">{new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                      <div className="text-2xl font-bold">{new Date(meeting.date).getDate()}</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-800 font-medium">{meeting.title}</h4>
                    <p className="text-gray-500 text-sm mt-1">{meeting.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-sm text-gray-500">
                        {meeting.startTime} - {meeting.endTime}
                      </div>
                      <div className="text-sm text-gray-500">
                        {meeting.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {upcomingMeetings.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No upcoming meetings
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="col-span-1"
        variants={item}
      >
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </div>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <Link 
              to="/tasks"
              className="flex items-center p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Add New Task</span>
            </Link>
            
            <Link 
              to="/teams"
              className="flex items-center p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Create Team</span>
            </Link>
            
            <Link 
              to="/calendar"
              className="flex items-center p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Schedule Meeting</span>
            </Link>
            
            <Link 
              to="/profile"
              className="flex items-center p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Update Profile</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;