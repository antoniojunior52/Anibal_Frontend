import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const HistoryTimelineItem = ({ item, onEdit, onDelete }) => {
  return (
    <div className="relative pl-10 pr-4 py-4">
      {/* O Ponto e a Linha da Timeline */}
      <div className="absolute left-0 top-5 h-full">
        <div className="absolute left-0 top-1 w-5 h-5 bg-white border-4 border-yellow-500 rounded-full z-10"></div>
        <div className="absolute left-[9px] top-3 w-0.5 h-full bg-gray-200"></div>
      </div>
      
      {/* Conteúdo do Marco Histórico */}
      <div className="relative bg-white p-5 rounded-xl border border-gray-200 transition-shadow hover:shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-yellow-600">{item.year}</p>
            <h3 className="text-lg font-bold text-gray-900 mt-1">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.description}</p>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0 ml-4">
            <button
              onClick={() => onEdit(item)}
              className="text-gray-500 p-2 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
              aria-label="Editar marco"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(item._id)}
              className="text-gray-500 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
              aria-label="Deletar marco"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTimelineItem;