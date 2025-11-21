import React from 'react';

// Placeholder de carregamento (Esqueleto) específico para Cartões de Notícia
const NewsCardSkeleton = () => {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white border border-gray-200">
      {/* animate-pulse faz o efeito visual de piscar/carregar */}
      <div className="animate-pulse flex flex-col h-full">
        {/* Placeholder da Imagem Grande */}
        <div className="w-full h-40 bg-gray-200 rounded-md mb-4"></div>
        
        <div className="flex items-start mb-4">
          {/* Placeholder do Ícone */}
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
          <div className="flex-grow">
            {/* Placeholder do Título */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            {/* Placeholder da Data */}
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Placeholder do Conteúdo (texto) */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default NewsCardSkeleton;