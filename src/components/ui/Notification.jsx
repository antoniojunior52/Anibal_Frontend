import React from "react";
import { X } from "lucide-react";

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  const typeStyles = {
    success: "bg-green-400",
    error: "bg-red-500",
    info: "bg-[#4455a3]",
  };
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-black font-bold transition-all duration-300 transform ${
        typeStyles[type]
      } ${
        message ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <span className="flex-grow">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 p-1 rounded-full hover:bg-black/20"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Notification;
