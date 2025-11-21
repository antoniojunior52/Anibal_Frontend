import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import AnimatedCard from "../ui/AnimatedCard";
import Pagination from "../ui/Pagination";
import { X, ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { API_URL } from "../../App";

// Página de Detalhes: Exibe todas as fotos de UM álbum específico
const AlbumDetailPage = ({ gallery, albumName, onBack }) => {
  
  // Filtra a galeria completa para pegar apenas as fotos deste álbum
  const imagesForThisAlbum = gallery.filter(
    (image) => (image.album || "Outras Fotos") === albumName
  );

  const [selectedImage, setSelectedImage] = useState(null); // Foto aberta no modal
  const [currentPage, setCurrentPage] = useState(1); // Paginação
  const itemsPerPage = 8;

  // Controle de Zoom da imagem no modal
  const [zoom, setZoom] = useState(1);

  // Lógica de Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGalleryItems = imagesForThisAlbum.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(imagesForThisAlbum.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Abre o modal e reseta o zoom para o padrão (1x)
  const openImageModal = (image) => {
    setZoom(1); 
    setSelectedImage(image);
  };
  
  // Funções de manipulação do Zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3)); // Máximo 3x
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5)); // Mínimo 0.5x
  const resetZoom = () => setZoom(1);

  return (
    <PageWrapper>
      <PageTitle
        title={albumName}
        subtitle={`Total de ${imagesForThisAlbum.length} fotos neste álbum.`}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Botão de Voltar */}
        <div className="mb-8">
          <button onClick={onBack} className="inline-flex items-center text-orange-600 hover:text-orange-800 font-semibold transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            Voltar para todos os álbuns
          </button>
        </div>
        
        {/* Grade de Fotos */}
        {currentGalleryItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list">
            {currentGalleryItems.map((image, index) => (
              <AnimatedCard key={image._id} style={{ animationDelay: `${index * 100}ms` }} className="h-full" role="listitem">
                <div
                  onClick={() => openImageModal(image)} // Abre o modal ao clicar
                  className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group aspect-square"
                  role="button"
                  tabIndex="0"
                >
                  <img
                    src={`${API_URL}${image.url}`}
                    alt={image.caption}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/CCCCCC/FFFFFF?text=Imagem`; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      {image.caption}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhuma imagem foi encontrada neste álbum.</p>
        )}

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>

      {/* Modal de Visualização (Lightbox) com Zoom */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)} // Fecha ao clicar fora
          role="dialog"
          aria-modal="true"
        >
          {/* Container da Imagem com Overflow para permitir mover a imagem com zoom */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar na imagem/container
          >
            <img
              src={`${API_URL}${selectedImage.url}`}
              alt={selectedImage.caption}
              className="transition-transform duration-200 rounded-lg shadow-2xl"
              style={{ transform: `scale(${zoom})`, cursor: 'grab' }} // Aplica o Zoom
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/800x600/CCCCCC/FFFFFF?text=Imagem`; }}
            />
          </div>

          {/* Legenda flutuante */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg bg-black/50 px-4 py-2 rounded-lg pointer-events-none">
            {selectedImage.caption}
          </p>

          {/* Botão Fechar */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white bg-[#ec9c30] rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
          >
            <X size={24} />
          </button>
          
          {/* Barra de Ferramentas de Zoom (Canto superior esquerdo) */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <button onClick={(e) => { e.stopPropagation(); handleZoomIn(); }} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors" aria-label="Aumentar zoom">
              <ZoomIn size={24} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleZoomOut(); }} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors" aria-label="Diminuir zoom">
              <ZoomOut size={24} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); resetZoom(); }} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors" aria-label="Redefinir zoom">
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default AlbumDetailPage;