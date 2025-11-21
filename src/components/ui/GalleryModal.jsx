import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { API_URL } from '../../App'; // Ajuste o caminho se o App.jsx não estiver 2 níveis acima

// Modal que exibe as fotos de um álbum específico em modo "tela cheia" ou sobreposta
// Permite visualizar e excluir fotos individualmente
const GalleryModal = ({ isOpen, onClose, photos, onDeleteImage }) => {
  // Se não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    // Overlay (fundo escuro) que cobre a tela toda
    <div 
      onClick={onClose} // Fecha o modal se clicar no fundo escuro
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
    >
      {/* Conteúdo do Modal (Janela branca) */}
      <div
        onClick={(e) => e.stopPropagation()} // Impede que o clique DENTRO do modal feche ele (para o clique não chegar na div pai)
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col transition-transform duration-300 transform scale-95 opacity-0 animate-fade-in-scale"
        style={{ animationFillMode: 'forwards' }} // Mantém o estado final da animação
      >
        
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Visualizar Álbum: 
            {/* Mostra o nome do álbum pegando a propriedade 'album' da primeira foto, se existir */}
            {photos.length > 0 && (
              <span className="text-sky-600 ml-2">{photos[0].album}</span>
            )}
          </h2>
          {/* Botão de fechar (X) no canto superior direito */}
          <button 
            onClick={onClose} 
            className="text-gray-400 p-2 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="Fechar"
          >
            <X size={28} />
          </button>
        </div>

        {/* Grade de Fotos (Área com rolagem/scroll) */}
        <div className="flex-1 overflow-y-auto p-6">
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              
              {/* Mapeia e exibe cada foto do array recebido */}
              {photos.map((photo) => (
                <div key={photo._id} className="relative group aspect-square rounded-lg overflow-hidden shadow-md">
                  <img
                    src={`${API_URL}${photo.url}`} // Monta a URL completa da imagem
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Botão de EXCLUIR foto individual (aparece ao passar o mouse) */}
                  <button
                    onClick={() => onDeleteImage(photo)} // Chama a função de deletar passada pelo pai
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-700 shadow-lg"
                    title="Apagar esta foto"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Legenda da foto (aparece ao passar o mouse no rodapé da imagem) */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.caption}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Mensagem caso o álbum esteja vazio (ex: após deletar a última foto)
            <div className="text-center py-10">
              <p className="text-gray-500">Este álbum não contém mais fotos.</p>
            </div>
          )}
        </div>

      </div>
      
      {/* Estilos CSS in-line para a animação de entrada do modal */}
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