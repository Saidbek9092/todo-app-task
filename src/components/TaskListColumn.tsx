import React from "react";
import TaskListHeader from "./TaskListHeader";

interface TaskListColumnProps {
  title: string;
  tasks: JSX.Element[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const TaskListColumn: React.FC<TaskListColumnProps> = ({
  title,
  tasks,
  onDragOver,
  onDrop,
}) => (
  <div
    className={`w-1/2 p-4 ${title === "TODO" ? "bg-blue-500" : "bg-green-500"}`}
    onDragOver={onDragOver}
    onDrop={onDrop}
  >
    <TaskListHeader title={title} />
    {tasks}
  </div>
);

export default TaskListColumn;
