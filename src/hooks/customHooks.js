// src/hooks/customHooks.js
import { useState, useEffect, useRef, useCallback } from 'react';
import apiService from '../services/apiService.js';

/**
 * Detecta quando um elemento se torna visível na tela para disparar animações.
 */
export const useScrollAnimation = () => {
  // ... (código do useScrollAnimation sem alterações)
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
 * Busca dados de um endpoint específico da API, gerenciando os estados
 * de carregamento, erro e permitindo refazer a busca.
 */
export const useDataFetching = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Este 'apiService' agora vem do arquivo importado
      const result = await apiService.get(endpoint);
      setData(result);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};