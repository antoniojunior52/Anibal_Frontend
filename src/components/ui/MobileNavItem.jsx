import React from "react";

// Botão simples para os itens do menu em telas pequenas (Mobile)
const MobileNavItem = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium text-left w-full"
  >
    {children}
  </button>
);

export default MobileNavItem;