import React from 'react';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { API_URL } from '../../App';

// Placeholder SVG para notícias sem imagem
const placeholderNews = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23e5e7eb'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18V6.375c0-.621.504-1.125 1.125-1.125H9.75' /%3E%3C/svg%3E";

// Componente Card para Notícias no Painel Admin
const NewsCard = ({ item, onEdit, onDelete }) => {
  // Formata a data de criação
  const formattedDate = new Date(item.createdAt || Date.now()).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
      <img 
        // Usa a imagem da notícia ou o placeholder
        src={item.image ? `${API_URL}${item.image}` : placeholderNews} 
        alt={item.title} 
        className="w-full h-48 object-cover bg-gray-100"
        onError={(e) => { e.target.onerror = null; e.target.src = placeholderNews; }}
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
        {/* Limita o texto para não estourar o card */}
        <p className="text-gray-600 text-sm flex-grow mb-4">
          {item.content.substring(0, 100)}{item.content.length > 100 && '...'}
        </p>
        {/* Rodapé com data e botões */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => onEdit(item)} className="text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors" aria-label="Editar notícia">
              <Pencil size={18} />
            </button>
            <button onClick={() => onDelete(item._id)} className="text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors" aria-label="Deletar notícia">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;