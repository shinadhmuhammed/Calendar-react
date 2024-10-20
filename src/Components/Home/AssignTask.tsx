import React, { useState, useEffect } from 'react';
import createAxios from '../../Services/Axios';
import { Employee } from '../../Types/Type'; 

interface AssignTaskProps {
  selectedDate: string;
  employees: Employee[];  
  onTaskAssigned: () => void; 
}

const AssignTask: React.FC<AssignTaskProps> = ({ selectedDate, employees, onTaskAssigned }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');  
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const axiosInstance = createAxios();

  useEffect(() => {
    const modal = document.getElementById('assign-task-modal');
    if (modal) modal.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !assignedTo) {  
      setError('Please provide a task title, description, and select an employee');
      return;
    }

    try {
      const response = await axiosInstance.post('/tasks', {
        title,
        description,  
        date: selectedDate,
        assignedTo, 
      });
      console.log(response.data);
      onTaskAssigned(); 
    } catch (error) {
      console.error('Error assigning task:', error);
      setError('Failed to assign task.');
    }
  };

  const handleCloseModal = () => {
    onTaskAssigned();  
  };

  return (
    <div
      id="assign-task-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 outline-none focus:outline-none"
      tabIndex={-1}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative z-50">
        <h2 className="text-xl font-semibold mb-4">Assign Task for {selectedDate}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Task Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Task Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={4}  
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Assign to Employee:</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.username}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTask;
