import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { API_URL } from '../../App'; // Ajuste o caminho se o App.jsx não estiver 2 níveis acima

const GalleryModal = ({ isOpen, onClose, photos, onDeleteImage }) => {
  if (!isOpen) return null;

  return (
    // Overlay
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
    >
      {/* Conteúdo do Modal */}
      <div
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col transition-transform duration-300 transform scale-95 opacity-0 animate-fade-in-scale"
        style={{ animationFillMode: 'forwards' }} // Mantém o estado final da animação
      >
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Visualizar Álbum: 
            {/* Mostra o nome do álbum (pega da primeira foto) */}
            {photos.length > 0 && (
              <span className="text-sky-600 ml-2">{photos[0].album}</span>
            )}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 p-2 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Fechar"
          >
            <X size={28} />
          </button>
        </div>

        {/* Grade de Fotos (com scroll) */}
        <div className="flex-1 overflow-y-auto p-6">
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              
              {/* Mapeia as fotos */}
              {photos.map((photo) => (
                <div key={photo._id} className="relative group aspect-square rounded-lg overflow-hidden shadow-md">
                  <img
                    src={`${API_URL}${photo.url}`} // Usa a URL da imagem grande
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* ***** AQUI ESTÁ O BOTÃO DE EXCLUIR FOTO INDIVIDUAL ***** */}
                  <button
                    onClick={() => onDeleteImage(photo)} // Chama a função vinda do GalleryFormFull
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-700 shadow-lg"
                    title="Apagar esta foto"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Overlay com legenda (opcional) */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.caption}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Este álbum não contém mais fotos.</p>
            </div>
          )}
        </div>

      </div>
      
      {/* Estilos para a animação (opcional, mas recomendado) */}
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default GalleryModal;