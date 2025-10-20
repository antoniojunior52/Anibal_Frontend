import React, { useState, useMemo } from "react";
import FormWrapper from "../ui/FormWrapper";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import { Camera, PlusCircle, List, Search } from "lucide-react";
import MultiImageUpload from "../ui/MultiImageUpload";
import LoadingSpinner from "../ui/LoadingSpinner";
import AlbumCard from "./AlbumCard";
import GalleryModal from "../ui/GalleryModal"; // Importe o novo modal

const GalleryFormFull = ({ gallery, fetchAllData, handleSave, handleDelete, showNotification, showConfirm }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [files, setFiles] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados para controlar o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPhotos, setModalPhotos] = useState([]);

  const resetForm = () => {
    setFiles([]);
    setAlbumName("");
  };

  const handleViewAlbum = (photos) => {
    setModalPhotos(photos);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalPhotos([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      showNotification("Selecione pelo menos uma imagem.", "error"); return;
    }
    if (!albumName.trim()) {
      showNotification("Por favor, dê um nome ao álbum.", "error"); return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("album", albumName.trim());
    files.forEach((file) => formData.append(`files`, file));

    try {
      await handleSave("/api/gallery", fetchAllData)(formData);
      resetForm();
      showNotification("Álbum adicionado com sucesso!", "success");
      setActiveTab("list");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAlbum = async (nameOfAlbumToDelete) => {
    const confirmed = await showConfirm(`Tem a certeza de que deseja apagar o álbum "${nameOfAlbumToDelete}" e todas as suas fotos?`);
    if (confirmed) {
      const encodedAlbumName = encodeURIComponent(nameOfAlbumToDelete);
      try {
        await handleDelete(`/api/gallery/album/${encodedAlbumName}`, fetchAllData)();
      } catch (error) {}
    }
  };
  
  const albums = useMemo(() => {
    const grouped = gallery.reduce((acc, photo) => {
      const album = photo.album || 'Outras Fotos';
      if (!acc[album]) {
        acc[album] = [];
      }
      acc[album].push(photo);
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, photos]) => ({ name, photos }));
  }, [gallery]);

  const tabClasses = (tabName) => `flex items-center justify-center w-full px-4 py-3 font-semibold transition-all duration-300 border-b-2
    ${activeTab === tabName ? "border-sky-500 text-sky-500" : "border-transparent text-gray-500 hover:text-gray-800"}`;

  return (
    <>
      <FormWrapper title="Gerir Galeria" icon={<Camera className="mr-2 text-sky-500" />}>
        <div className="flex border-b border-gray-200 mb-6">
          <button onClick={() => setActiveTab("list")} className={tabClasses("list")}>
            <List size={18} className="mr-2" />
            Álbuns da Galeria ({albums.length})
          </button>
          <button onClick={() => setActiveTab("form")} className={tabClasses("form")}>
            <PlusCircle size={18} className="mr-2" />
            Adicionar Novo Álbum
          </button>
        </div>

        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <MultiImageUpload label="Selecione as Imagens do Álbum" onChange={setFiles} maxFiles={20} />
            <FloatingLabelInput id="gallery-album-name" label="Nome do Novo Álbum" type="text" value={albumName} onChange={(e) => setAlbumName(e.target.value)} required />
            <div className="flex flex-col sm:flex-row gap-4">
              <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-sky-500 text-white p-3 rounded-md shadow-sm hover:bg-sky-600 transition-colors disabled:bg-gray-400">
                {isLoading ? <LoadingSpinner size="sm" /> : "Adicionar Álbum"}
              </button>
              <button type="button" onClick={() => { resetForm(); setActiveTab("list"); }} className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600">
                Cancelar
              </button>
            </div>
          </form>
        )}

        {activeTab === 'list' && (
          <div className="animate-fade-in">
            <div className="relative mb-8">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Buscar por nome do álbum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
            </div>
            {(() => {
              const filteredAlbums = albums.filter(album => album.name.toLowerCase().includes(searchQuery.toLowerCase()));
              if (filteredAlbums.length > 0) {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredAlbums.map(album => (
                      <AlbumCard 
                        key={album.name}
                        albumName={album.name}
                        photos={album.photos}
                        onView={handleViewAlbum} // Passa a função para o card
                        onDelete={handleDeleteAlbum}
                      />
                    ))}
                  </div>
                );
              }
              if (albums.length > 0 && filteredAlbums.length === 0) {
                return (
                  <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                    <p className="text-gray-600 font-semibold">Nenhum álbum encontrado</p>
                    <p className="text-gray-500 mt-2">Tente um termo de busca diferente.</p>
                  </div>
                );
              }
              return (
                <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                  <p className="text-gray-500">Nenhum álbum na galeria ainda.</p>
                  <button onClick={() => { resetForm(); setActiveTab("form"); }} className="mt-4 bg-sky-500 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-sky-600 transition-all">
                    <PlusCircle size={18} className="inline mr-2" />
                    Criar primeiro álbum
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </FormWrapper>
      
      {/* Renderiza o modal fora do FormWrapper para que ele possa cobrir a tela toda */}
      <GalleryModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        photos={modalPhotos}
      />
    </>
  );
};

export default GalleryFormFull;