import React from "react";

// Botão individual da barra de navegação principal (Desktop)
// Possui um efeito de sublinhado animado ao passar o mouse
const NavItem = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-gray-600 hover:text-[#4455a3] transition duration-300 px-3 py-2 rounded-md text-sm font-medium relative group"
  >
    {children}
    {/* Linha sublinhada que cresce da esquerda para a direita no hover */}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ec9c30] group-hover:w-full transition-all duration-300"></span>
  </button>
);

export default NavItem;