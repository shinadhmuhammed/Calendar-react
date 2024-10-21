import createAxios from '../Services/Axios';
import { Event, Employee, Task, UserRole } from '../Types/Type';

const axiosInstance = createAxios();

const CalendarAPI = {
  fetchEmployees: async (): Promise<Employee[]> => {
    const response = await axiosInstance.get<Employee[]>('/employees');
    return response.data;
  },

  fetchUserRole: async (): Promise<UserRole> => {
    const response = await axiosInstance.get<UserRole>('/user/role');
    return response.data;
  },

  fetchTasks: async (): Promise<Event[]> => {
    const response = await axiosInstance.get<Event[]>('/getTasks');
    return response.data;
  },

  fetchUserTasks: async (role: string): Promise<Task[]> => {
  const endpoint = role === 'Manager' ? '/tasks/manager-tasks' : '/tasks/my-tasks';
  const response = await axiosInstance.get<Task[]>(endpoint);
  return response.data;
},

  fetchAllTasks: async (): Promise<Event[]> => {
    const response = await axiosInstance.get<Event[]>('/tasks');
    return response.data;
  },
};

export default CalendarAPI;
