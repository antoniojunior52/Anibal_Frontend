import { useState, useEffect, useRef } from "react";

// Hook para animação ao rolar a tela
// Detecta quando um elemento entra na visão do usuário (viewport)
export const useScrollAnimation = () => {
  const ref = useRef(null); // Referência ao elemento que queremos observar
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    // Cria um observador que dispara quando 10% do elemento está visível
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); // Ativa a animação
          observer.unobserve(entry.target); // Para de observar (anima só uma vez)
        }
      },
      { threshold: 0.1 }
    );
    if (element) {
      observer.observe(element);
    }
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);
  return [ref, isVisible];
};

// Função utilitária para carregar a biblioteca SheetJS (Excel) dinamicamente
// Evita carregar o script pesado se o usuário não estiver na página de horários
export const loadSheetJS = (callback) => {
  const existingScript = document.getElementById("sheetjs");
  
  // Se o script ainda não existe, cria e adiciona ao corpo da página
  if (!existingScript) {
    const script = document.createElement("script");
    script.src =
      "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
    script.id = "sheetjs";
    document.body.appendChild(script);
    // Executa o callback (ação desejada) assim que o script terminar de carregar
    script.onload = () => {
      if (callback) callback();
    };
  }
  // Se já existe, executa o callback imediatamente
  if (existingScript && callback) callback();
};