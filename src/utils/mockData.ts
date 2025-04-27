import { Team, Task, Meeting } from '../context/DataContext';

export const generateMockData = () => {
  // Mock team data
  const teams: Team[] = [
    {
      id: 't1',
      name: 'Web Development Team',
      members: ['Student 1', 'Student 2', 'Student 3'],
      leaderId: 'leader1',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    },
    {
      id: 't2',
      name: 'Mobile App Team',
      members: ['Student 4', 'Student 5', 'Student 6'],
      leaderId: 'leader2',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    },
    {
      id: 't3',
      name: 'UI/UX Design Team',
      members: ['Student 7', 'Student 8'],
      leaderId: 'leader3',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    },
  ];

  // Mock task data
  const tasks: Task[] = [
    {
      id: 'task1',
      title: 'Create Homepage Wireframe',
      description: 'Design a wireframe for the project homepage with clear navigation and user flow.',
      assignedTo: 't3',
      createdBy: 'manager1',
      status: 'completed',
      priority: 'high',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    },
    {
      id: 'task2',
      title: 'Implement User Authentication',
      description: 'Create user login and registration forms with validation.',
      assignedTo: 't1',
      createdBy: 'manager1',
      status: 'in-progress',
      priority: 'high',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      id: 'task3',
      title: 'Database Schema Design',
      description: 'Design the database schema for the project with proper relationships.',
      assignedTo: 't1',
      createdBy: 'leader1',
      status: 'pending',
      priority: 'medium',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      id: 'task4',
      title: 'Mobile App Prototype',
      description: 'Create a clickable prototype of the mobile app using Figma.',
      assignedTo: 't2',
      createdBy: 'leader2',
      status: 'review',
      priority: 'medium',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    },
    {
      id: 'task5',
      title: 'API Documentation',
      description: 'Document all API endpoints with examples and response formats.',
      assignedTo: 't1',
      createdBy: 'manager1',
      status: 'pending',
      priority: 'low',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
  ];

  // Mock meeting data
  const meetings: Meeting[] = [
    {
      id: 'meeting1',
      title: 'Weekly Project Review',
      description: 'Review progress of all teams and discuss blockers.',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // tomorrow
      startTime: '09:00',
      endTime: '10:30',
      attendees: ['manager1', 'leader1', 'leader2', 'leader3'],
      location: 'Conference Room A',
      createdBy: 'manager1',
    },
    {
      id: 'meeting2',
      title: 'Frontend Development Planning',
      description: 'Plan the next sprint for the frontend team.',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 3 days from now
      startTime: '14:00',
      endTime: '15:00',
      attendees: ['leader1', 'teamleader1'],
      location: 'Meeting Room B',
      createdBy: 'leader1',
    },
    {
      id: 'meeting3',
      title: 'Design Review',
      description: 'Review UI designs and collect feedback.',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 2 days from now
      startTime: '11:00',
      endTime: '12:00',
      attendees: ['leader3', 'manager1'],
      location: 'Online (Zoom)',
      createdBy: 'leader3',
    },
  ];

  return { teams, tasks, meetings };
};