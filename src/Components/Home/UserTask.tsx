import React, { useState } from 'react';

import createAxios from '../../Services/Axios'; 
import EditTask from './EditTask';

interface TaskModalProps {
  tasks: any[];  
  selectedDate: string | null;  
  onClose: () => void;  
  onTaskDeleted: () => void; 
}

const UserTask: React.FC<TaskModalProps> = ({ tasks, selectedDate, onClose, onTaskDeleted }) => {
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const axiosInstance = createAxios(); 

  const handleEditClick = (task: any) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditingTask(null);
    setShowEditModal(false);
  };

  const handleDeleteClick = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        onTaskDeleted(); 
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75"
      tabIndex={-1}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative z-50">
        <h2 className="text-xl font-semibold mb-4">Tasks for {selectedDate}</h2>
        
        {tasks.length > 0 ? (
          <ul className="list-disc pl-5">
            {tasks.map((task) => (
              <li key={task._id} className="mb-2">
                <strong>{task.title}</strong> - {task.description}
                <div className="text-sm text-gray-500">Assigned by: {task.createdBy.username}</div>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleEditClick(task)} // Handle edit click
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task._id)} 
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No tasks assigned for this date.</div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>

      {showEditModal && editingTask && (
        <EditTask
          task={editingTask}
          onClose={handleCloseEditModal}
          onTaskUpdated={() => {
            handleCloseEditModal();
            onTaskDeleted(); 
          }}
        />
      )}
    </div>
  );
};

export default UserTask;
