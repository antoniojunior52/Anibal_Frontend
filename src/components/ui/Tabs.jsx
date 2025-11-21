import React, { useState } from 'react';

// Componente de Abas para alternar conteúdo na mesma tela
const Tabs = ({ tabs }) => {
  // Estado que guarda o ID da aba que está visível no momento (inicia com a primeira)
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <div className="w-full">
      {/* Cabeçalho das abas (Botões) */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            // Estilização condicional: Se for a aba ativa, coloca cor azul e borda inferior
            className={`py-2 px-4 text-sm font-medium focus:outline-none transition-colors duration-200
              ${activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Conteúdo das abas */}
      <div className="py-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            // Mostra apenas o conteúdo cujo ID bate com a aba ativa (activeTab)
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;