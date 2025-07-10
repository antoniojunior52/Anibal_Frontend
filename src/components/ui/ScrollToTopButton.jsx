// components/ui/ScrollToTopButton.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Função para verificar a posição de rolagem
  const toggleVisibility = useCallback(() => {
    if (window.pageYOffset > 300) { // Mostrar o botão após rolar 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  // Adicionar e remover o event listener de rolagem
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [toggleVisibility]);

  // Função para rolar para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Rolagem suave
    });
  };

  return (
    <button
      onClick={scrollToTop}
      // Alterado o background-color para uma cor de destaque que contraste com o rodapé
      className={`fixed bottom-6 right-6 bg-[#ec9c30] text-white p-3 rounded-full shadow-lg
        hover:bg-[#d68a2a] transition-all duration-300 transform
        ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        focus:outline-none focus:ring-2 focus:ring-[#ec9c30] focus:ring-opacity-75`}
      aria-label="Voltar ao topo da página" // Rótulo ARIA para acessibilidade
      title="Voltar ao Topo" // Dica de ferramenta
    >
      <ChevronUp size={24} aria-hidden="true" /> {/* Ícone decorativo */}
    </button>
  );
};

export default ScrollToTopButton;
