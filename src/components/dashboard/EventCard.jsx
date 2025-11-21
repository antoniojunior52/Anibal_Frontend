import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

// Componente Card para exibir um Evento individual na lista de gerenciamento
const EventCard = ({ item, onEdit, onDelete }) => {
  // Ajusta o fuso horário para garantir que o dia exibido esteja correto
  const eventDate = new Date(item.date);
  eventDate.setMinutes(eventDate.getMinutes() + eventDate.getTimezoneOffset());
  
  const day = eventDate.toLocaleDateString('pt-BR', { day: '2-digit' });
  const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-start gap-5 transition-all duration-300 hover:shadow-xl hover:border-pink-300 hover:-translate-y-1">
      {/* Bloco Visual da Data (Dia grande, Mês pequeno) */}
      <div className="flex-shrink-0 text-center bg-pink-50 text-pink-600 font-bold w-20 h-20 rounded-lg flex flex-col items-center justify-center">
        <span className="text-4xl leading-none">{day}</span>
        <span className="text-sm tracking-wider">{month}</span>
      </div>
      
      {/* Título e Descrição do Evento */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {item.description}
        </p>
      </div>

      {/* Botões de Editar e Excluir */}
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-1 self-start sm:self-center">
        <button 
          onClick={() => onEdit(item)} 
          className="text-gray-500 p-2 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
          aria-label="Editar evento"
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={() => onDelete(item._id)} 
          className="text-gray-500 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
          aria-label="Deletar evento"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default EventCard;