import React from "react";

// Cabeçalho padrão para as páginas, com título grande e subtítulo centralizados
const PageTitle = ({ title, subtitle }) => (
  <div className="py-12 bg-gray-100 text-center mb-12">
    <h2 className="text-4xl font-extrabold text-[#1f2937] tracking-tight">{title}</h2>
    <p className="text-lg text-gray-500 mt-2 max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

export default PageTitle;