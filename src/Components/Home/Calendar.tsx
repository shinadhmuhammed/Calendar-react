import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import createAxios from '../../Services/Axios';
import AssignTask from './AssignTask';
import UserTask from './UserTask';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [userTasks, setUserTasks] = useState<any[]>([]);  
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);  
  const [userRole, setUserRole] = useState<string | null>(null); 
  const axiosInstance = createAxios();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get('/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchUserRole = async () => { 
      try {
        const response = await axiosInstance.get('/user/role'); 
        console.log(response.data.role,'role')
        setUserRole(response.data.role); 
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
        const response = await axiosInstance.get('/getTasks');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleDateClick = async (arg: any) => {
    const clickedDate = arg.dateStr;
    setSelectedDate(clickedDate);

    try {
      const response = await axiosInstance.get('/tasks/my-tasks');
      const allTasks = response.data;
      const filteredTasks = allTasks.filter((task: any) => {
        const taskDate = new Date(task.date).toISOString().split('T')[0];  // Get date part from task
        return taskDate === clickedDate;  
      });

      setUserTasks(filteredTasks);  // Set only the tasks for the clicked date
      setShowTaskModal(true);  // Open the modal
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };

  const handleTaskAssigned = async () => {
    const response = await axiosInstance.get('/tasks');
    setEvents(response.data);
    setSelectedDate(null);  
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
        />
      )}
    </div>
  );
};

export default Calendar;
