import React from 'react';
import { Trash2, UserCircle } from 'lucide-react';

// Função para formatar a data de forma amigável
const formatNoticeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const noticeDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (noticeDay.getTime() === today.getTime()) {
    return `Hoje às ${time}`;
  }
  if (noticeDay.getTime() === yesterday.getTime()) {
    return `Ontem às ${time}`;
  }
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) + ` às ${time}`;
};

const NoticeItem = ({ notice, user, onDelete }) => {
  // Garante que o autor e o nome existam para evitar erros
  const authorName = notice.author?.name || 'Autor desconhecido';
  const formattedDate = notice.createdAt ? formatNoticeDate(notice.createdAt) : '';

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-start">
        {/* Conteúdo do Recado */}
        <div className="flex-grow pr-4">
          <p className="text-gray-800 whitespace-pre-wrap">{notice.content}</p>
          <div className="flex items-center text-xs text-gray-500 mt-3">
            <UserCircle size={14} className="mr-1.5" />
            <span>{authorName} • {formattedDate}</span>
          </div>
        </div>
        
        {/* Botão de Excluir (visível apenas para admin) */}
        {user?.isAdmin && (
          <div className="flex-shrink-0">
            <button
              onClick={() => onDelete(notice._id)}
              className="text-gray-500 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
              aria-label="Deletar recado"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeItem;