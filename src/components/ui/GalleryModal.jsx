import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const GalleryModal = ({ photos, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const goToPrevious = useCallback(() => {
    setIsLoading(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? photos.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, photos]);

  const goToNext = useCallback(() => {
    setIsLoading(true);
    const isLastSlide = currentIndex === photos.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, photos]);
  
  // Efeito para navegação com teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, goToPrevious, goToNext, onClose]);

  // Reseta o índice e o loading quando as fotos mudam
  useEffect(() => {
    setCurrentIndex(0);
    setIsLoading(true);
  }, [photos]);

  if (!isOpen || !photos || photos.length === 0) {
    return null;
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="relative bg-black p-4 rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-black p-2 rounded-full z-10 transition-transform hover:scale-110"
          aria-label="Fechar galeria"
        >
          <X size={24} />
        </button>

        {/* Imagem Principal e Navegação */}
        <div className="relative w-full h-full flex items-center justify-center">
          {isLoading && <LoadingSpinner message="Carregando imagem..." />}
          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.album || 'Foto da Galeria'}
            className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)} // Lida com erro de carregamento
          />
          
          {/* Seta Esquerda */}
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-50 text-black p-2 rounded-full transition-opacity hover:bg-opacity-80"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={32} />
          </button>
          
          {/* Seta Direita */}
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-50 text-black p-2 rounded-full transition-opacity hover:bg-opacity-80"
            aria-label="Próxima foto"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Contador */}
        <div className="text-white text-center mt-2">
          <p>{currentIndex + 1} / {photos.length}</p>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;