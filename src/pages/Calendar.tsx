import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, X, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Calendar = () => {
  const { user } = useAuth();
  const { meetings, tasks, addMeeting, updateMeeting, deleteMeeting } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    startTime: '09:00',
    endTime: '10:00',
    attendees: [''],
    location: '',
    createdBy: user?.id || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMeeting({ ...newMeeting, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentMeeting({ ...currentMeeting, [name]: value });
  };

  const handleAttendeeChange = (index: number, value: string) => {
    const updatedAttendees = [...newMeeting.attendees];
    updatedAttendees[index] = value;
    setNewMeeting({ ...newMeeting, attendees: updatedAttendees });
  };

  const handleEditAttendeeChange = (index: number, value: string) => {
    const updatedAttendees = [...currentMeeting.attendees];
    updatedAttendees[index] = value;
    setCurrentMeeting({ ...currentMeeting, attendees: updatedAttendees });
  };

  const addAttendeeField = () => {
    setNewMeeting({ ...newMeeting, attendees: [...newMeeting.attendees, ''] });
  };

  const addEditAttendeeField = () => {
    setCurrentMeeting({ ...currentMeeting, attendees: [...currentMeeting.attendees, ''] });
  };

  const removeAttendeeField = (index: number) => {
    const updatedAttendees = [...newMeeting.attendees];
    updatedAttendees.splice(index, 1);
    setNewMeeting({ ...newMeeting, attendees: updatedAttendees });
  };

  const removeEditAttendeeField = (index: number) => {
    const updatedAttendees = [...currentMeeting.attendees];
    updatedAttendees.splice(index, 1);
    setCurrentMeeting({ ...currentMeeting, attendees: updatedAttendees });
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty attendee fields
    const filteredAttendees = newMeeting.attendees.filter(attendee => attendee.trim() !== '');
    
    if (newMeeting.title.trim() === '') {
      toast.error('Meeting title is required');
      return;
    }
    
    if (filteredAttendees.length === 0) {
      toast.error('At least one attendee is required');
      return;
    }
    
    if (newMeeting.location.trim() === '') {
      toast.error('Meeting location is required');
      return;
    }
    
    // Validate time format
    if (newMeeting.startTime >= newMeeting.endTime) {
      toast.error('End time must be after start time');
      return;
    }
    
    addMeeting({
      title: newMeeting.title,
      description: newMeeting.description,
      date: newMeeting.date,
      startTime: newMeeting.startTime,
      endTime: newMeeting.endTime,
      attendees: filteredAttendees,
      location: newMeeting.location,
      createdBy: user?.id || '',
    });
    
    setNewMeeting({
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      startTime: '09:00',
      endTime: '10:00',
      attendees: [''],
      location: '',
      createdBy: user?.id || '',
    });
    
    setIsAddModalOpen(false);
    toast.success('Meeting scheduled successfully');
  };

  const handleUpdateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMeeting) return;
    
    // Filter out empty attendee fields
    const filteredAttendees = currentMeeting.attendees.filter((attendee: string) => attendee.trim() !== '');
    
    if (currentMeeting.title.trim() === '') {
      toast.error('Meeting title is required');
      return;
    }
    
    if (filteredAttendees.length === 0) {
      toast.error('At least one attendee is required');
      return;
    }
    
    if (currentMeeting.location.trim() === '') {
      toast.error('Meeting location is required');
      return;
    }
    
    // Validate time format
    if (currentMeeting.startTime >= currentMeeting.endTime) {
      toast.error('End time must be after start time');
      return;
    }
    
    updateMeeting(currentMeeting.id, {
      title: currentMeeting.title,
      description: currentMeeting.description,
      date: currentMeeting.date,
      startTime: currentMeeting.startTime,
      endTime: currentMeeting.endTime,
      attendees: filteredAttendees,
      location: currentMeeting.location,
    });
    
    setIsEditModalOpen(false);
    toast.success('Meeting updated successfully');
  };

  const handleDeleteMeeting = () => {
    if (!currentMeeting) return;
    
    deleteMeeting(currentMeeting.id);
    setIsDeleteModalOpen(false);
    toast.success('Meeting deleted successfully');
  };

  const openEditModal = (meeting: any) => {
    setCurrentMeeting(meeting);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (meeting: any) => {
    setCurrentMeeting(meeting);
    setIsDeleteModalOpen(true);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Add cells for days in the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true });
    }
    
    return days;
  };

  const generateWeekDays = () => {
    const current = new Date(currentDate);
    const day = current.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate the start date of the week (Sunday)
    current.setDate(current.getDate() - day);
    
    const days = [];
    
    // Generate 7 days starting from Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(current);
      date.setDate(date.getDate() + i);
      days.push({ date, isCurrentMonth: date.getMonth() === currentDate.getMonth() });
    }
    
    return days;
  };

  const getEventsForDay = (day: number | null, isCurrentMonth: boolean) => {
    if (day === null || !isCurrentMonth) return { meetings: [], tasks: [] };
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateString = new Date(year, month, day).toISOString().slice(0, 10);
    
    // Get meetings for this day
    const meetingsForDay = meetings.filter(meeting => meeting.date === dateString);
    
    // Get tasks with deadlines on this day
    const tasksForDay = tasks.filter(task => {
      const taskDate = new Date(task.deadline).toISOString().slice(0, 10);
      return taskDate === dateString;
    });
    
    return { meetings: meetingsForDay, tasks: tasksForDay };
  };

  const getEventsForWeekDay = (date: Date) => {
    const dateString = date.toISOString().slice(0, 10);
    
    // Get meetings for this day
    const meetingsForDay = meetings.filter(meeting => meeting.date === dateString);
    
    // Get tasks with deadlines on this day
    const tasksForDay = tasks.filter(task => {
      const taskDate = new Date(task.deadline).toISOString().slice(0, 10);
      return taskDate === dateString;
    });
    
    return { meetings: meetingsForDay, tasks: tasksForDay };
  };

  const navigateToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const navigateToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const navigateToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const navigateToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
          <p className="text-gray-600">View and manage meetings and deadlines</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white border rounded-lg overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'month' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'week' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
          </div>
          
          <button
            className="px-3 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
            onClick={navigateToToday}
          >
            Today
          </button>
          
          <div className="flex items-center bg-white border rounded-lg overflow-hidden">
            <button
              className="px-3 py-2 text-gray-700 hover:bg-gray-50"
              onClick={viewMode === 'month' ? navigateToPreviousMonth : navigateToPreviousWeek}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="px-4 py-2 font-medium">
              {viewMode === 'month' ? (
                <span>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              ) : (
                <span>{`Week of ${new Date(generateWeekDays()[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}</span>
              )}
            </div>
            <button
              className="px-3 py-2 text-gray-700 hover:bg-gray-50"
              onClick={viewMode === 'month' ? navigateToNextMonth : navigateToNextWeek}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} className="mr-1" /> Schedule Meeting
          </motion.button>
        </div>
      </div>

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="grid grid-cols-7 text-center border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={index} className="py-3 font-medium text-gray-500 text-sm">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 auto-rows-fr min-h-[600px]">
            {generateCalendarDays().map((day, index) => {
              const events = getEventsForDay(day.day, day.isCurrentMonth);
              const isToday = day.isCurrentMonth && day.day === new Date().getDate() && 
                            currentDate.getMonth() === new Date().getMonth() && 
                            currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <div 
                  key={index} 
                  className={`border-b border-r p-2 min-h-[100px] ${
                    !day.isCurrentMonth ? 'bg-gray-50' : ''
                  }`}
                >
                  {day.day && (
                    <>
                      <div className={`text-right mb-2 ${isToday ? 'bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center ml-auto' : 'text-gray-700'}`}>
                        {day.day}
                      </div>
                      <div className="space-y-1 overflow-y-auto max-h-24">
                        {Array.isArray(events.meetings) && events.meetings.map((meeting: any) => (
                          <div 
                            key={meeting.id} 
                            className="text-xs bg-red-100 text-red-800 rounded px-2 py-1 truncate cursor-pointer"
                            onClick={() => openEditModal(meeting)}
                          >
                            <span className="font-medium">{formatTime(meeting.startTime)}</span> - {meeting.title}
                          </div>
                        ))}
                        {Array.isArray(events.tasks) && events.tasks.map((task: any) => (
                          <div 
                            key={task.id}
                            className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 truncate"
                          >
                            <span className="font-medium">Due:</span> {task.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="grid grid-cols-7 text-center border-b">
            {generateWeekDays().map((day, index) => {
              const isToday = day.date.getDate() === new Date().getDate() && 
                           day.date.getMonth() === new Date().getMonth() && 
                           day.date.getFullYear() === new Date().getFullYear();
              
              return (
                <div key={index} className={`py-3 ${isToday ? 'bg-red-50' : ''}`}>
                  <div className="text-sm font-medium text-gray-500">
                    {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg ${isToday ? 'text-red-600 font-bold' : 'text-gray-800'}`}>
                    {day.date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 min-h-[600px]">
            {generateWeekDays().map((day, index) => {
              const events = getEventsForWeekDay(day.date);
              const isToday = day.date.getDate() === new Date().getDate() && 
                           day.date.getMonth() === new Date().getMonth() && 
                           day.date.getFullYear() === new Date().getFullYear();
              
              return (
                <div 
                  key={index} 
                  className={`border-r p-2 ${
                    isToday ? 'bg-red-50' : day.isCurrentMonth ? '' : 'bg-gray-50'
                  }`}
                >
                  <div className="space-y-2 overflow-y-auto h-full">
                    {Array.isArray(events.meetings) && events.meetings.length === 0 && Array.isArray(events.tasks) && events.tasks.length === 0 && (
                      <div className="text-center text-gray-400 text-xs mt-4">No events</div>
                    )}
                    {Array.isArray(events.meetings) && events.meetings.map((meeting: any) => (
                      <div 
                        key={meeting.id} 
                        className="bg-white shadow-sm border border-red-200 rounded-lg p-3 text-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => openEditModal(meeting)}
                      >
                        <div className="font-medium text-gray-800 mb-1">{meeting.title}</div>
                        <div className="flex items-center text-gray-500 text-xs mb-1">
                          <Clock size={12} className="mr-1" />
                          <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <MapPin size={12} className="mr-1" />
                          <span>{meeting.location}</span>
                        </div>
                      </div>
                    ))}
                    {Array.isArray(events.tasks) && events.tasks.map((task: any) => (
                      <div 
                        key={task.id}
                        className="bg-white shadow-sm border border-blue-200 rounded-lg p-3 text-sm hover:shadow-md transition-shadow"
                      >
                        <div className="font-medium text-gray-800 mb-1">Due: {task.title}</div>
                        <div className="text-xs text-blue-600 mb-1">Task Deadline</div>
                        <div className="text-xs text-gray-500 line-clamp-2">{task.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event List for Small Screens */}
      <div className="mt-8 lg:hidden">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Upcoming Events</h2>
        
        <div className="space-y-4">
          {meetings
            .filter(meeting => new Date(`${meeting.date}T${meeting.startTime}`) >= new Date())
            .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
            .slice(0, 5)
            .map(meeting => (
              <div 
                key={meeting.id}
                className="bg-white shadow-sm border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openEditModal(meeting)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-800">{meeting.title}</div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-1 text-gray-500 hover:text-red-600 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(meeting);
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="p-1 text-gray-500 hover:text-red-600 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(meeting);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">{meeting.description}</div>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center text-gray-500">
                    <CalendarIcon size={14} className="mr-2" />
                    <span>{formatDate(new Date(meeting.date))}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock size={14} className="mr-2" />
                    <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin size={14} className="mr-2" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users size={14} className="mr-2" />
                    <span>{meeting.attendees.length} Attendees</span>
                  </div>
                </div>
              </div>
            ))}
          
          {meetings.filter(meeting => new Date(`${meeting.date}T${meeting.startTime}`) >= new Date()).length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg border">
              <CalendarIcon size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No upcoming meetings</p>
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={() => setIsAddModalOpen(true)}
              >
                Schedule Meeting
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Meeting Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Schedule Meeting</h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddMeeting} className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newMeeting.title}
                      onChange={handleInputChange}
                      placeholder="Enter meeting title"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={newMeeting.description}
                      onChange={handleInputChange}
                      placeholder="Enter meeting description"
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={newMeeting.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={newMeeting.startTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={newMeeting.endTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={newMeeting.location}
                      onChange={handleInputChange}
                      placeholder="Enter meeting location"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
                    {newMeeting.attendees.map((attendee, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={attendee}
                          onChange={(e) => handleAttendeeChange(index, e.target.value)}
                          placeholder="Enter attendee name"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                        {newMeeting.attendees.length > 1 && (
                          <button
                            type="button"
                            className="ml-2 text-gray-400 hover:text-red-600"
                            onClick={() => removeAttendeeField(index)}
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-700 flex items-center mt-2"
                      onClick={addAttendeeField}
                    >
                      <Plus size={16} className="mr-1" /> Add Another Attendee
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Schedule Meeting
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Meeting Modal */}
      <AnimatePresence>
        {isEditModalOpen && currentMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Edit Meeting</h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateMeeting} className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                    <input
                      type="text"
                      id="edit-title"
                      name="title"
                      value={currentMeeting.title}
                      onChange={handleEditInputChange}
                      placeholder="Enter meeting title"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={currentMeeting.description}
                      onChange={handleEditInputChange}
                      placeholder="Enter meeting description"
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      id="edit-date"
                      name="date"
                      value={currentMeeting.date}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="edit-startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        id="edit-startTime"
                        name="startTime"
                        value={currentMeeting.startTime}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        id="edit-endTime"
                        name="endTime"
                        value={currentMeeting.endTime}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      id="edit-location"
                      name="location"
                      value={currentMeeting.location}
                      onChange={handleEditInputChange}
                      placeholder="Enter meeting location"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
                    {currentMeeting.attendees.map((attendee: string, index: number) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={attendee}
                          onChange={(e) => handleEditAttendeeChange(index, e.target.value)}
                          placeholder="Enter attendee name"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                        {currentMeeting.attendees.length > 1 && (
                          <button
                            type="button"
                            className="ml-2 text-gray-400 hover:text-red-600"
                            onClick={() => removeEditAttendeeField(index)}
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:text-red-700 flex items-center mt-2"
                      onClick={addEditAttendeeField}
                    >
                      <Plus size={16} className="mr-1" /> Add Another Attendee
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Update Meeting
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && currentMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-5 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Meeting</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the meeting "{currentMeeting.title}"? This action cannot be undone.
                </p>
                
                <div className="flex justify-center gap-3">
                  <button
                    className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    onClick={handleDeleteMeeting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;