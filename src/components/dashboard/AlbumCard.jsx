import React from 'react';
import { Trash2, Eye } from 'lucide-react';
// 1. IMPORTAÇÃO DA URL DA API (ajuste o caminho se necessário)
import { API_URL } from '../../App';

// Placeholder embutido para imagens da galeria (SVG codificado)
const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23e5e7eb'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' /%3E%3C/svg%3E";

// Componente Card que representa um Álbum no Painel Administrativo
// Exibe um grid 2x2 com prévias das fotos
const AlbumCard = ({ albumName, photos, onView, onDelete }) => {
  const previewPhotos = photos.slice(0, 4);
  // Completa com placeholders se tiver menos de 4 fotos
  while (previewPhotos.length < 4) {
    previewPhotos.push({ _id: `placeholder-${previewPhotos.length}`, url: '' });
  }

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
      {/* Grade de prévia das imagens (2x2) */}
      <div className="grid grid-cols-2 grid-rows-2 gap-1">
        {previewPhotos.map((photo, index) => (
          <div key={photo._id || index} className="aspect-square bg-gray-100">
            <img
              // 2. CORREÇÃO DE PERFORMANCE: Usa thumbnailUrl se existir, senão usa a url principal.
              src={(photo.thumbnailUrl || photo.url) ? `${API_URL}${photo.thumbnailUrl || photo.url}` : placeholderImage}
              alt={`Preview ${index + 1} for ${albumName}`}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
            />
          </div>
        ))}
      </div>

      {/* Informações e Ações do Álbum */}
      <div className="p-4 border-t border-gray-100">
        <h3 className="font-bold text-lg text-gray-800 truncate">{albumName}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">{photos.length} foto{photos.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center space-x-1">
            {/* Botão para abrir o modal e ver as fotos */}
            <button
              onClick={() => onView(photos)}
              className="text-gray-500 p-2 rounded-full hover:bg-sky-100 hover:text-sky-600 transition-colors"
              aria-label={`Visualizar álbum ${albumName}`}
              title="Visualizar Álbum"
            >
              <Eye size={18} />
            </button>
            {/* Botão para excluir o álbum inteiro */}
            <button
              onClick={() => onDelete(albumName)}
              className="text-gray-500 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
              aria-label={`Apagar álbum ${albumName}`}
              title="Apagar Álbum"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;