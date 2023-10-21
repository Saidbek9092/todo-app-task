import React from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  order_id?: number;
  status: "TODO" | "DONE" | "IN PROGRESS";
  estimate: number;
  created_at: string;
  soft_delete?: boolean;
}

interface TaskItemProps {
  task: Task;
  openModal: (data: Task | null) => void;
  openDeleteModal: (data: Task) => void;
  handleDragStart: (e: React.DragEvent, task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  openModal,
  openDeleteModal,
  handleDragStart,
}) => {
  return (
    <div
      key={task.id}
      className="bg-white p-4 border rounded mb-4 shadow-lg cursor-pointer"
      draggable
      onDragStart={e => handleDragStart(e, task)}
    >
      <h3 className="text-xl font-semibold">{task.title}</h3>
      <p className="text-gray-700">{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Estimate: {task.estimate} story points</p>
      <p>Created at: {task.created_at}</p>
      <div className="mt-2 flex space-x-2">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() => openModal(task)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => openDeleteModal(task)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
