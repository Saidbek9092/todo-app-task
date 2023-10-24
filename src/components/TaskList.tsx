import React, { useEffect, useState } from "react";
import taskStore from "../TaskStore";
import TaskCreationModal from "./TaskCreationModal";
import TaskDeleteModal from "./TaskDeleteModal";
import TaskItem from "./TaskItem";
import TaskListColumn from "./TaskListColumn";
import CreateTaskButton from "./CreateTaskButton";
import { observer } from "mobx-react-lite";

type Task = {
  id: number;
  title: string;
  description: string;
  order_id?: number;
  status: "TODO" | "DONE" | "IN PROGRESS";
  estimate: number;
  created_at: string;
  soft_delete?: boolean;
};

const TaskList = observer(() => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [chosenTaskId, setChosenTaskId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (search.trim() === "") {
      taskStore.fetchTasks().then(() => {
        setLoading(false);
      });
    } else {
      taskStore.searchTasks(search);
    }
  }, [search]);

  if (loading) {
    return <h1>Loading ...</h1>;
  }

  const openDeleteModal = (data: Task) => {
    setChosenTaskId(data.id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setChosenTaskId(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = (taskID: number | null) => {
    if (taskID !== null) {
      taskStore.deleteTask(taskID);
    }
    closeDeleteModal();
  };

  const openModal = (task: Task | null) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  const saveTask = (task: Task) => {
    taskStore.addTask(task);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setChosenTaskId(null);
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setChosenTaskId(null);
  };

  const handleDrop = (
    e: React.DragEvent,
    targetColumn: "TODO" | "DONE" | "IN PROGRESS"
  ) => {
    setChosenTaskId(null);
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData("text/plain")) as Task;

    if (task && targetColumn && task.status !== targetColumn) {
      taskStore.editTask(task.id, { ...task, status: targetColumn });
    }
    setDraggedTask(null);
  };

  const todoTasksList = taskStore.tasks
    .filter(task => task.status === "TODO")
    .map(task => (
      <TaskItem
        key={task.id}
        task={task}
        openModal={(data: Task | null) => openModal(data)}
        openDeleteModal={(data: Task) => openDeleteModal(data)}
        handleDragStart={(e: React.DragEvent) => handleDragStart(e, task)}
      />
    ));

  const progTasksList = taskStore.tasks
    .filter(task => task.status === "IN PROGRESS")
    .map(task => (
      <TaskItem
        key={task.id}
        task={task}
        openModal={(data: Task | null) => openModal(data)}
        openDeleteModal={(data: Task) => openDeleteModal(data)}
        handleDragStart={(e: React.DragEvent) => handleDragStart(e, task)}
      />
    ));

  const completedTasksList = taskStore.tasks
    .filter(task => task.status === "DONE")
    .map(task => (
      <TaskItem
        key={task.id}
        task={task}
        openModal={(data: Task | null) => openModal(data)}
        openDeleteModal={(data: Task) => openDeleteModal(data)}
        handleDragStart={(e: React.DragEvent) => handleDragStart(e, task)}
      />
    ));

  return (
    <div>
      <CreateTaskButton onClick={() => openModal(null)} />
      <TaskCreationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveTask}
        taskToEdit={taskToEdit || undefined}
      />
      <input
        type="text"
        placeholder="Task Title"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 mx-2"
      />
      <div className="flex my-4 mx-2">
        <TaskListColumn
          title="TODO"
          tasks={todoTasksList}
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, "TODO")}
        />
        <TaskListColumn
          title="IN PROGRESS"
          tasks={progTasksList}
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, "IN PROGRESS")}
        />
        <TaskListColumn
          title="DONE"
          tasks={completedTasksList}
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, "DONE")}
        />
      </div>
      <TaskDeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => handleConfirmDelete(chosenTaskId)}
      />
    </div>
  );
});

export default TaskList;
