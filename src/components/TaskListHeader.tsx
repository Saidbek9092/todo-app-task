import React from "react";

interface TaskListHeaderProps {
  title: string;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({ title }) => (
  <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white">
    {title}
  </h2>
);

export default TaskListHeader;
