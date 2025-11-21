// src/hooks/customHooks.js
import { useState, useEffect, useRef, useCallback } from 'react';
import apiService from '../services/apiService.js';

/**
 * Detecta quando um elemento se torna visível na tela para disparar animações.
 * (Versão duplicada/alternativa do hook acima)
 */
export const useScrollAnimation = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return [ref, isVisible];
};

/**
 * Hook genérico para buscar dados da API
 * Gerencia automaticamente os estados de: Dados, Carregando e Erro
 */
export const useDataFetching = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Função que realiza a busca
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Usa o serviço centralizado para fazer o GET
      const result = await apiService.get(endpoint);
      setData(result);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Executa a busca assim que o componente monta ou o endpoint muda
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Retorna os estados e a função 'refetch' para forçar uma nova busca (ex: botão "Tentar Novamente")
  return { data, loading, error, refetch: fetchData };
};