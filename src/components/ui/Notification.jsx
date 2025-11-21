import React from "react";
import { X } from "lucide-react";

// Componente de notificação tipo "Toast" (pop-up no canto da tela)
const Notification = ({ message, type, onClose }) => {
  if (!message) return null; // Se não tem mensagem, não mostra nada

  // 1. Consolidei todos os estilos em um único objeto
  const typeStyles = {
    success: "bg-green-400 text-black", 
    error: "bg-red-500 text-white",     
    info: "bg-[#4455a3] text-white",  
  };

  // 2. Determinei as classes de estilo (com um padrão seguro)
  const styleClasses = typeStyles[type] || "bg-gray-500 text-white";

  return (
    // 3. Apliquei tudo em UM ÚNICO 'className'
    // Usa 'translate-x' para fazer a animação de deslizar da direita
    <div
      className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg font-bold transition-all duration-300 transform 
        ${styleClasses} 
        ${message ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <span className="flex-grow">{message}</span>
      {/* Botão de fechar a notificação */}
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