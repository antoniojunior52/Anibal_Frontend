import React from "react";
import { useScrollAnimation } from "../../hooks/hooks"; // Importa o hook personalizado para animação de scroll

const AnimatedCard = ({ children, className }) => {
  // Usando o hook personalizado para detectar a visibilidade do elemento durante o scroll
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref} // Atribui a referência do elemento ao hook de animação de scroll
      className={`transition-all duration-700 ${ // Aplica transições suaves de todos os estilos com duração de 700ms
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`} // Aplica animação de opacidade e deslocamento no eixo Y, dependendo da visibilidade
    >
      {children} {/* Renderiza os filhos (conteúdo dentro do AnimatedCard) */}
    </div>
  );
};

export default AnimatedCard;
