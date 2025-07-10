// components/ui/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  // Limitar o número de botões de página visíveis para não sobrecarregar a UI
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8" aria-label="Navegação de Página"> {/* Adicionado para acessibilidade */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Página anterior"
      >
        <ChevronLeft size={20} aria-hidden="true" /> {/* Ícone decorativo */}
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-md font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            aria-label="Ir para a página 1" // Rótulo para acessibilidade
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-500" aria-hidden="true">...</span>}
        </>
      )}

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
            ${currentPage === number
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          aria-current={currentPage === number ? 'page' : undefined} // Indica a página atual
          aria-label={`Ir para a página ${number}`} // Rótulo para acessibilidade
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-500" aria-hidden="true">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-md font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            aria-label={`Ir para a última página, página ${totalPages}`} // Rótulo para acessibilidade
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Próxima página"
      >
        <ChevronRight size={20} aria-hidden="true" /> {/* Ícone decorativo */}
      </button>
    </nav>
  );
};

export default Pagination;
