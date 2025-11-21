import React from 'react';

// Placeholder de carregamento para cartões de aviso (Notícias/Mural)
const NoticeCardSkeleton = () => {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white border border-gray-200">
      {/* Animação de "pulso" para indicar que está carregando */}
      <div className="animate-pulse flex flex-col h-full">
        <div className="flex items-start mb-4">
          {/* Círculo cinza simulando ícone ou avatar */}
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
          <div className="flex-grow">
            {/* Barras cinzas simulando título e data */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        {/* Barras cinzas simulando o texto do corpo do aviso */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default NoticeCardSkeleton;