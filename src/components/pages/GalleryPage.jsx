import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import AnimatedCard from "../ui/AnimatedCard";
import Pagination from "../ui/Pagination"; // Importar o componente de Paginação
import { X } from "lucide-react";
import { API_URL } from "../../App";

const GalleryPage = ({ gallery }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Definir quantas imagens por página

  // Calcular imagens para a página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGalleryItems = gallery.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(gallery.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <PageWrapper>
      <PageTitle
        title="Galeria de Momentos"
        subtitle="Reviva os melhores momentos da nossa comunidade escolar."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentGalleryItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list"> {/* Adicionado role="list" */}
            {currentGalleryItems.map((image, index) => (
              <AnimatedCard
                key={image._id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="h-full"
                role="listitem" // Adicionado role="listitem"
              >
                <div
                  onClick={() => setSelectedImage(image)}
                  className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group aspect-w-1 aspect-h-1"
                  role="button" // Indica que o div é clicável
                  tabIndex="0" // Torna o div focável
                  aria-label={`Ver imagem ${image.caption} em tamanho maior`} // Rótulo para acessibilidade
                  onKeyPress={(e) => { if (e.key === 'Enter') setSelectedImage(image); }} // Ativar com Enter
                >
                  <img
                    src={`${API_URL}${image.url}`}
                    alt={image.caption}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/CCCCCC/FFFFFF?text=Imagem+indisponível`; }}
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
          <p className="text-center text-gray-500">Nenhuma imagem na galeria.</p>
        )}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
          role="dialog" // Papel ARIA para modal
          aria-modal="true" // Indica que o conteúdo por trás não é interativo
          aria-label={`Visualização da imagem: ${selectedImage.caption}`} // Rótulo para leitores de tela
        >
          <div className="relative">
            <img
              src={`${API_URL}${selectedImage.url}`}
              alt={selectedImage.caption}
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/800x600/CCCCCC/FFFFFF?text=Imagem+indisponível`; }}
            />
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg bg-black/50 px-4 py-2 rounded-lg">
              {selectedImage.caption}
            </p>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 text-white bg-[#ec9c30] rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
              aria-label="Fechar visualização da imagem" // Rótulo para acessibilidade
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default GalleryPage;
