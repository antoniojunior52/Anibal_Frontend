import React from "react";

// Container padrão para envolver formulários. Adiciona título, ícone e sombreamento.
const FormWrapper = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Cabeçalho do formulário com ícone e título */}
      <h3 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2 flex items-center text-gray-800">
        {icon}
        {title}
      </h3>
      {/* Renderiza os campos do formulário passados como filhos (children) */}
      {children}
    </div>
  );

export default FormWrapper;