import React, { useEffect, useState } from "react";
import taskStore from "./TaskStore";

interface Task {
  id: number;
  title: string;
  description: string;
  order_id?: number;
  status: "TODO" | "DONE";
  estimate: number;
  created_at: string;
  soft_delete?: boolean;
}

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  taskToEdit?: Task;
}

const currentDate = new Date();
const year = currentDate.getFullYear().toString().slice(-2);
const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const day = currentDate.getDate().toString().padStart(2, "0");
const hours = currentDate.getHours().toString().padStart(2, "0");
const minutes = currentDate.getMinutes().toString().padStart(2, "0");

const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
    }
  }, [taskToEdit]);
  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (title.trim() === "" || description.trim() === "") {
      setError("Title and description are required.");
      return;
    }
    const task: Task = {
      id: taskToEdit ? taskToEdit.id : Math.random(),
      title,
      description,
      status: taskToEdit ? taskToEdit.status : "TODO",
      estimate: 0,
      created_at: formattedDate,
    };

    if (taskToEdit) {
      taskStore.editTask(taskToEdit.id, task);
    } else {
      onSave(task);
    }
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-4 border rounded">
        <input
          required
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
        />

        <textarea
          required
          placeholder="Task Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={handleSave}
          >
            {taskToEdit ? "Save Changes" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCreationModal;
