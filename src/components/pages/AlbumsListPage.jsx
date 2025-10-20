// src/pages/AlbumsListPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../ui/PageWrapper';
import PageTitle from '../ui/PageTitle';
import AnimatedCard from '../ui/AnimatedCard';
import { API_URL } from '../../App'; // Certifique-se que o caminho está correto

const AlbumsListPage = ({ gallery }) => {
  // Agrupa todas as imagens por nome de álbum
  const albums = gallery.reduce((acc, image) => {
    // Se uma imagem não tiver álbum, ela vai para um álbum padrão "Outras Fotos"
    const albumName = image.album || 'Outras Fotos';
    
    if (!acc[albumName]) {
      acc[albumName] = {
        cover: image.url, // Usa a primeira imagem encontrada como capa do álbum
        images: [],
      };
    }
    acc[albumName].images.push(image);
    return acc;
  }, {});

  // Transforma o objeto de álbuns em um array para poder usar o .map()
  const albumList = Object.entries(albums);

  return (
    <PageWrapper>
      <PageTitle
        title="Galeria de Momentos"
        subtitle="Explore nossos álbuns e reviva os melhores momentos."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {albumList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list">
            {albumList.map(([albumName, albumData], index) => (
              <AnimatedCard
                key={albumName}
                style={{ animationDelay: `${index * 100}ms` }}
                className="h-full"
                role="listitem"
              >
                {/* O Link envolve o card para navegar para a página de detalhes do álbum */}
                {/* encodeURIComponent é importante para nomes de álbuns com espaços ou caracteres especiais */}
                <Link to={`/gallery/${encodeURIComponent(albumName)}`}>
                  <div
                    className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group aspect-square"
                    aria-label={`Ver álbum ${albumName}`}
                  >
                    <img
                      src={`${API_URL}${albumData.cover}`}
                      alt={`Capa do álbum ${albumName}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/CCCCCC/FFFFFF?text=Álbum`; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-4">
                      <div className="text-center">
                        <h3 className="text-white text-lg font-bold drop-shadow-md">{albumName}</h3>
                        <p className="text-white text-sm drop-shadow-md">{albumData.images.length} fotos</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhum álbum encontrado na galeria.</p>
        )}
      </div>
    </PageWrapper>
  );
};

export default AlbumsListPage;