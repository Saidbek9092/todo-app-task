import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const TaskDeleteModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-4 border rounded">
        <p>Are you sure you want to delete this task?</p>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDeleteModal;
