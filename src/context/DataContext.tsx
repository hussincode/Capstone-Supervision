import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { generateMockData } from '../utils/mockData';

export interface Team {
  id: string;
  name: string;
  members: string[];
  leaderId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // team id
  createdBy: string; // user id
  status: 'pending' | 'in-progress' | 'completed' | 'review';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[]; // user ids
  location: string;
  createdBy: string; // user id
}

interface DataContextType {
  teams: Team[];
  tasks: Task[];
  meetings: Meeting[];
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const { isAuthenticated } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  // Initialize or load data from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const savedTeams = localStorage.getItem('teams');
      const savedTasks = localStorage.getItem('tasks');
      const savedMeetings = localStorage.getItem('meetings');

      if (savedTeams && savedTasks && savedMeetings) {
        setTeams(JSON.parse(savedTeams));
        setTasks(JSON.parse(savedTasks));
        setMeetings(JSON.parse(savedMeetings));
      } else {
        // Generate mock data if nothing is saved
        const mockData = generateMockData();
        setTeams(mockData.teams);
        setTasks(mockData.tasks);
        setMeetings(mockData.meetings);
        
        // Save the mock data to localStorage
        localStorage.setItem('teams', JSON.stringify(mockData.teams));
        localStorage.setItem('tasks', JSON.stringify(mockData.tasks));
        localStorage.setItem('meetings', JSON.stringify(mockData.meetings));
      }
    }
  }, [isAuthenticated]);

  // Save changes to localStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('teams', JSON.stringify(teams));
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('meetings', JSON.stringify(meetings));
    }
  }, [teams, tasks, meetings, isAuthenticated]);

  // Team operations
  const addTeam = (team: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...team,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTeams([...teams, newTeam]);
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams(teams.map(team => team.id === id ? { ...team, ...updates } : team));
  };

  const deleteTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
  };

  // Task operations
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updates } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Meeting operations
  const addMeeting = (meeting: Omit<Meeting, 'id'>) => {
    const newMeeting: Meeting = {
      ...meeting,
      id: Math.random().toString(36).substring(2, 9),
    };
    setMeetings([...meetings, newMeeting]);
  };

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings(meetings.map(meeting => meeting.id === id ? { ...meeting, ...updates } : meeting));
  };

  const deleteMeeting = (id: string) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
  };

  return (
    <DataContext.Provider value={{
      teams,
      tasks,
      meetings,
      addTeam,
      updateTeam,
      deleteTeam,
      addTask,
      updateTask,
      deleteTask,
      addMeeting,
      updateMeeting,
      deleteMeeting,
    }}>
      {children}
    </DataContext.Provider>
  );
};