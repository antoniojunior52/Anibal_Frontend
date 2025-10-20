import React from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import AnimatedCard from "../ui/AnimatedCard";
import { API_URL } from "../../App";

const GalleryPage = ({ gallery, navigate }) => {
  // Lógica para agrupar as imagens por álbum
  const albums = gallery.reduce((acc, image) => {
    const albumName = image.album || "Outras Fotos";
    
    if (!acc[albumName]) {
      acc[albumName] = {
        cover: image.url,
        count: 0,
      };
    }
    acc[albumName].count += 1;
    return acc;
  }, {});

  const albumList = Object.entries(albums);

  return (
    <PageWrapper>
      <PageTitle
        title="Galeria de Momentos"
        subtitle="Explore nossos álbuns e reviva os melhores momentos da nossa comunidade."
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
                {/* O card do álbum usa uma <div> com onClick para navegação */}
                <div 
                  onClick={() => navigate('gallery-album', albumName)}
                  className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group aspect-square"
                  aria-label={`Ver álbum ${albumName}`}
                  role="button"
                  tabIndex="0"
                  onKeyPress={(e) => { if (e.key === 'Enter') navigate('gallery-album', albumName); }}
                >
                  <img
                    src={`${API_URL}${albumData.cover}`}
                    alt={`Capa do álbum ${albumName}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/CCCCCC/FFFFFF?text=Álbum`; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center text-center p-4">
                    <div>
                      <h3 className="text-white text-lg font-bold drop-shadow-md">{albumName}</h3>
                      <p className="text-white text-sm drop-shadow-md">{albumData.count} fotos</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhum álbum foi encontrado na galeria.</p>
        )}
      </div>
    </PageWrapper>
  );
};

export default GalleryPage;

