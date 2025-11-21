import React from 'react';

// Componente que exibe um "esqueleto" (placeholder) enquanto os dados reais estão carregando
const EventCardSkeleton = () => {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white border border-gray-200">
      {/* animate-pulse cria o efeito de "piscar" para indicar carregamento */}
      <div className="animate-pulse flex flex-col h-full">
        <div className="flex items-start mb-4">
          {/* Simula o ícone ou avatar redondo */}
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
          <div className="flex-grow">
            {/* Simula o título */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            {/* Simula o subtítulo ou data */}
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        {/* Simula as linhas de texto/descrição do evento */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;