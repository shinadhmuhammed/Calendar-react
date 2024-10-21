import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import createAxios from "../../Services/Axios";
import EditTask from "./EditTask";
import { Task } from "../../Types/Type";

interface TaskModalProps {
  tasks: Task[];
  selectedDate: string | null;
  onClose: () => void;
  onTaskDeleted: () => void;
  userRole: string;
}

const UserTask: React.FC<TaskModalProps> = ({
  tasks: initialTasks,
  selectedDate,
  onClose,
  onTaskDeleted,
  userRole,
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const axiosInstance = createAxios();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditingTask(null);
    setShowEditModal(false);
  };

  const handleDeleteClick = async (taskId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/tasks/${taskId}`);
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );

          onTaskDeleted();
        } catch (error) {
          Swal.fire(
            "Error!",
            "Error deleting task. Please try again.",
            "error"
          );
          console.error("Error deleting task:", error);
        }
      }
    });
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
                <div className="text-sm text-gray-500">
  {userRole === "Employee" && (
    <span>Assigned by: {task.createdBy.username}</span>
  )}
  {userRole === "Manager" && (
    <span>Assigned to: {task.assignedTo.username}</span>
  )}
</div>

                <div className="flex justify-between mt-2">
                  {userRole !== "Employee" && (
                    <>
                      <button
                        onClick={() => handleEditClick(task)}
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
                    </>
                  )}
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
