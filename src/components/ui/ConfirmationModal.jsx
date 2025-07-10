// components/ui/ConfirmationModal.jsx
import React from 'react';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null; // Do not render if not open

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800 mb-6">{message}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors duration-200"
            >
              Confirmar
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
