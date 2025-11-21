import React from "react";

// Container simples para envolver páginas inteiras
// Adiciona uma animação suave de entrada (fade-in) ao carregar a página
const PageWrapper = ({ children }) => <div className="animate-fade-in">{children}</div>;

export default PageWrapper;