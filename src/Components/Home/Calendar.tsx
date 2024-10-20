import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import AssignTask from './AssignTask';
import UserTask from './UserTask';
import { Event, Employee, Task } from '../../Types/Type'; 
import CalendarAPI from '../../API/CalenderAPI';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [userTasks, setUserTasks] = useState<Task[]>([]);  
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);  
  const [userRole, setUserRole] = useState<string | null>(null); 

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

  const handleDateClick = async (arg: { dateStr: string }) => { 
    const clickedDate = arg.dateStr;
    setSelectedDate(clickedDate);

    try {
      const allTasks = await CalendarAPI.fetchUserTasks(); 
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

  const handleTaskAssigned = async () => {
    try {
      const tasksData = await CalendarAPI.fetchAllTasks();
      setEvents(tasksData);
      setSelectedDate(null);  
    } catch (error) {
      console.error('Error fetching all tasks:', error);
    }
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
  };

  return (
    <div className="p-6">
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
        />
      )}

      {showTaskModal && (
        <UserTask
          tasks={userTasks}
          selectedDate={selectedDate}
          onClose={handleCloseTaskModal} 
          onTaskDeleted={() => {}} 
        />
      )}
    </div>
  );
};

export default Calendar;
