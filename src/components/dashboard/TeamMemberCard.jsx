import React from 'react';
import { Pencil, Trash2, BookOpen } from 'lucide-react';
// 1. IMPORTAÇÃO DA URL DA API (ajuste o caminho se necessário)
import { API_URL } from '../../App';

// Placeholder embutido para garantir que sempre funcione
const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e5e7eb'%3E%3Cpath fill-rule='evenodd' d='M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' clip-rule='evenodd' /%3E%3C/svg%3E";

const TeamMemberCard = ({ member, onEdit, onDelete }) => {
  const { photo, name, role, subjects } = member;

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
      <div className="relative bg-gray-100">
        <div className="absolute top-2 right-2 z-10 space-x-1">
          <button onClick={() => onEdit(member)} className="p-2 bg-white bg-opacity-75 rounded-full text-blue-600 hover:bg-opacity-100 hover:scale-110 transition-all" aria-label={`Editar ${name}`}>
            <Pencil size={16} />
          </button>
          <button onClick={() => onDelete(member._id)} className="p-2 bg-white bg-opacity-75 rounded-full text-red-600 hover:bg-opacity-100 hover:scale-110 transition-all" aria-label={`Apagar ${name}`}>
            <Trash2 size={16} />
          </button>
        </div>
        <img
          // 2. CORREÇÃO APLICADA: Monta a URL completa se a imagem existir
          src={photo ? `${API_URL}${photo}` : placeholderImage}
          alt={`Foto de ${name}`}
          className="w-full h-56 object-cover object-center"
        />
      </div>
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-purple-600 font-semibold mt-1">{role}</p>
        {subjects && subjects.length > 0 && (
          <div className="flex items-center justify-center text-sm text-gray-500 mt-2">
            <BookOpen size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate">{subjects.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;