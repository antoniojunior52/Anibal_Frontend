// components/ui/Modal.jsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef(null);

  // Gerir o foco para acessibilidade (trap focus dentro do modal)
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
        // Implementar focus trapping se necessário para modais complexos
        // Para este modal simples, o 'Escape' e o clique no fundo são suficientes
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let maxWidthClass = 'max-w-md'; // Default size

  switch (size) {
    case 'sm':
      maxWidthClass = 'max-w-sm';
      break;
    case 'lg':
      maxWidthClass = 'max-w-2xl';
      break;
    case 'xl':
      maxWidthClass = 'max-w-4xl';
      break;
    case 'full':
      maxWidthClass = 'max-w-full mx-4'; // Full width with some margin
      break;
    default:
      maxWidthClass = 'max-w-md';
  }

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose} // Fechar modal ao clicar fora
      role="dialog" // Papel ARIA para modal
      aria-modal="true" // Indica que o conteúdo por trás não é interativo
      aria-labelledby="modal-title" // Liga ao título do modal para leitores de tela
      tabIndex="-1" // Permite que o modal receba foco programaticamente
      ref={modalRef}
    >
      <div
        className={`bg-white rounded-lg shadow-xl p-6 w-full ${maxWidthClass} transform transition-all duration-300 scale-100 opacity-100`}
        onClick={(e) => e.stopPropagation()} // Impedir que o clique no modal feche-o
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 id="modal-title" className="text-xl font-bold text-gray-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Fechar modal" // Rótulo ARIA para acessibilidade
          >
            <X size={24} aria-hidden="true" /> {/* Ícone decorativo */}
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
