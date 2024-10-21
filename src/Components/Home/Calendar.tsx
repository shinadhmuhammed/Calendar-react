import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import AssignTask from './AssignTask';
import UserTask from './UserTask';
import { Event, Employee, Task } from '../../Types/Type'; 
import CalendarAPI from '../../API/CalenderAPI';
import { useNavigate } from 'react-router-dom';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [userTasks, setUserTasks] = useState<Task[]>([]);  
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);  
  const [userRole, setUserRole] = useState<string | null>(null); 
  const navigate = useNavigate();

  // Fetch employees and user role when component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = await CalendarAPI.fetchEmployees();
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchUserRole = async () => { 
      try {
        const userRoleData = await CalendarAPI.fetchUserRole(); 
        setUserRole(userRoleData.role); 
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchEmployees();
    fetchUserRole();
  }, []);

  // Fetch all tasks and set events in the calendar when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await CalendarAPI.fetchTasks(); 
        setEvents(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Handle date click and fetch tasks for that specific date
  const handleDateClick = async (arg: { dateStr: string }) => { 
    const clickedDate = arg.dateStr;
    setSelectedDate(clickedDate);
  
    try {
      const allTasks = await CalendarAPI.fetchUserTasks(userRole || 'Employee');
      const filteredTasks = allTasks.filter((task) => {
        const taskDate = new Date(task.date).toISOString().split('T')[0];  
        return taskDate === clickedDate;  
      });
  
      setUserTasks(filteredTasks); 
      setShowTaskModal(true);  
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };
  
  // Refetch all tasks to update calendar events
  const fetchAndSetTasks = async () => {
    try {
      const tasksData = await CalendarAPI.fetchAllTasks();
      setEvents(tasksData);
    } catch (error) {
      console.error('Error fetching all tasks:', error);
    }
  };

  // Handle task assignment, refetch tasks to update events
  const handleTaskAssigned = async () => {
    await fetchAndSetTasks();
    setSelectedDate(null);  
  };

  // Handle task deletion or edit, refetch tasks to update events dynamically
  const handleTaskDeleted = async () => {
    await fetchAndSetTasks();
    setShowTaskModal(false);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/');
  };

  return (
    <div className="p-6">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded mb-4"
      >
        Logout
      </button>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick} 
      />

      {selectedDate && userRole === 'Manager' && ( 
        <AssignTask
          selectedDate={selectedDate}
          employees={employees}
          onTaskAssigned={handleTaskAssigned}
          onClose={() => setSelectedDate(null)} 
        />
      )}

      {showTaskModal && (
        <UserTask
          tasks={userTasks}
          selectedDate={selectedDate}
          onClose={handleCloseTaskModal} 
          onTaskDeleted={handleTaskDeleted}  
          userRole={userRole || 'Employee'} 
        />
      )}
    </div>
  );
};

export default Calendar;
