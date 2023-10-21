import React from "react";

interface CreateTaskButtonProps {
  onClick: () => void;
}

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({ onClick }) => (
  <button
    className="bg-green-500 text-white p-2 rounded-md my-4 mx-2"
    onClick={onClick}
  >
    Create Task
  </button>
);

export default CreateTaskButton;
