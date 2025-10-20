import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import AnimatedCard from "../ui/AnimatedCard";
import Pagination from "../ui/Pagination";
// NOVO: Importar ícones para os controlos de zoom
import { X, ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { API_URL } from "../../App";

const AlbumDetailPage = ({ gallery, albumName, onBack }) => {
  const imagesForThisAlbum = gallery.filter(
    (image) => (image.album || "Outras Fotos") === albumName
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // NOVO: Estado para controlar o nível de zoom da imagem no modal
  const [zoom, setZoom] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGalleryItems = imagesForThisAlbum.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(imagesForThisAlbum.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // NOVO: Função para abrir a imagem e redefinir o zoom
  const openImageModal = (image) => {
    setZoom(1); // Redefine o zoom sempre que uma nova imagem é aberta
    setSelectedImage(image);
  };
  
  // NOVO: Funções para controlar o zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3)); // Limite máximo de zoom 3x
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5)); // Limite mínimo de zoom 0.5x
  const resetZoom = () => setZoom(1);

  return (
    <PageWrapper>
      <PageTitle
        title={albumName}
        subtitle={`Total de ${imagesForThisAlbum.length} fotos neste álbum.`}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-8">
          <button onClick={onBack} className="inline-flex items-center text-orange-600 hover:text-orange-800 font-semibold transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            Voltar para todos os álbuns
          </button>
        </div>
        
        {currentGalleryItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list">
            {currentGalleryItems.map((image, index) => (
              <AnimatedCard key={image._id} style={{ animationDelay: `${index * 100}ms` }} className="h-full" role="listitem">
                <div
                  onClick={() => openImageModal(image)} // Usa a nova função
                  className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group aspect-square"
                  role="button"
                  tabIndex="0"
                  aria-label={`Ver imagem ${image.caption} em tamanho maior`}
                  onKeyPress={(e) => { if (e.key === 'Enter') openImageModal(image); }}
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

      {/* Modal de visualização de imagem completamente refeito */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Container da Imagem com Overflow para permitir o Pan (arrastar) quando o zoom é aplicado */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()} // Impede que o clique na imagem feche o modal
          >
            <img
              src={`${API_URL}${selectedImage.url}`}
              alt={selectedImage.caption}
              className="transition-transform duration-200 rounded-lg shadow-2xl"
              style={{ transform: `scale(${zoom})`, cursor: 'grab' }}
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/800x600/CCCCCC/FFFFFF?text=Imagem`; }}
            />
          </div>

          {/* Legenda da Imagem */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg bg-black/50 px-4 py-2 rounded-lg pointer-events-none">
            {selectedImage.caption}
          </p>

          {/* Botão de Fechar */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white bg-[#ec9c30] rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
            aria-label="Fechar visualização da imagem"
          >
            <X size={24} />
          </button>
          
          {/* Controlos de Zoom */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* CORREÇÃO: Adicionado e.stopPropagation() para impedir que o modal feche */}
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

