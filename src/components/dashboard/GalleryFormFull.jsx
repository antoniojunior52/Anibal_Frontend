import React, { useState, useMemo } from "react";
import FormWrapper from "../ui/FormWrapper";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import { Camera, PlusCircle, List, Search } from "lucide-react";
import MultiImageUpload from "../ui/MultiImageUpload";
import LoadingSpinner from "../ui/LoadingSpinner";
import AlbumCard from "./AlbumCard";
import GalleryModal from "../ui/GalleryModal";

/**
 * Componente: GalleryFormFull
 * Descrição: Gerencia a criação de álbuns, upload de fotos e exclusão (CRUD da Galeria).
 * * Props:
 * - gallery: Lista completa de fotos vinda do App.js
 * - fetchAllData: Função para recarregar os dados após uma ação
 * - handleSave: Função genérica do App.js para POST/PUT (agora repassa erros)
 * - handleDelete: Função genérica do App.js para DELETE
 * - showNotification: Função para exibir Toasts (Sucesso/Erro)
 * - showConfirm: Função para exibir modal de confirmação
 */
const GalleryFormFull = ({ gallery, fetchAllData, handleSave, handleDelete, showNotification, showConfirm }) => {
  // --- ESTADOS ---
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list"); // Controla se vê a Lista ou o Formulário
  const [files, setFiles] = useState([]); // Array de arquivos selecionados no upload
  const [albumName, setAlbumName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados do Modal de Visualização de Fotos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPhotos, setModalPhotos] = useState([]);

  // --- FUNÇÕES AUXILIARES ---

  // Limpa o formulário após salvar ou cancelar
  const resetForm = () => {
    setFiles([]);
    setAlbumName("");
  };

  // Abre o modal ao clicar em um álbum
  const handleViewAlbum = (photos) => {
    setModalPhotos(photos);
    setIsModalOpen(true);
  };

  // Fecha o modal e limpa a seleção
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalPhotos([]);
  };

  // --- AÇÕES DO USUÁRIO (HANDLERS) ---

  /**
   * Envia o novo álbum e fotos para o servidor (POST)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações básicas antes de enviar
    if (files.length === 0) {
      showNotification("Selecione pelo menos uma imagem.", "error"); return;
    }
    if (!albumName.trim()) {
      showNotification("Por favor, dê um nome ao álbum.", "error"); return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("album", albumName.trim());
    
    // Adiciona cada arquivo selecionado ao FormData
    files.forEach((file) => formData.append(`files`, file));

    try {
      // Chama a API. Se der erro (ex: NSFW), vai cair no catch abaixo.
      await handleSave("/api/gallery", fetchAllData)(formData);
      
      resetForm();
      showNotification("Álbum adicionado com sucesso!", "success");
      setActiveTab("list");
    } catch (error) {
      // CORREÇÃO: Agora exibimos o erro que veio do backend (ex: Conteúdo Bloqueado)
      showNotification(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Exclui um álbum inteiro e suas fotos
   */
  const handleDeleteAlbum = async (nameOfAlbumToDelete) => {
    const confirmed = await showConfirm(`Tem a certeza de que deseja apagar o álbum "${nameOfAlbumToDelete}" e todas as suas fotos?`);
    
    if (confirmed) {
      const encodedAlbumName = encodeURIComponent(nameOfAlbumToDelete);
      try {
        await handleDelete(`/api/gallery/album/${encodedAlbumName}`, fetchAllData)();
      } catch (error) {
        // Exibe erro caso falhe ao deletar o álbum
        showNotification(error.message, "error");
      }
    }
  };
  
  /**
   * Exclui uma única imagem de dentro de um álbum (chamado pelo Modal)
   */
  const handleDeleteImage = async (photo) => {
    const confirmed = await showConfirm(`Tem a certeza de que deseja apagar esta foto do álbum "${photo.album}"?`);
    
    if (confirmed) {
      try {
        await handleDelete(`/api/gallery/${photo._id}`, fetchAllData)(); 
        
        // Atualiza a lista local do modal para a imagem sumir na hora (sem recarregar tudo)
        setModalPhotos(prevPhotos => prevPhotos.filter(p => p._id !== photo._id));
        showNotification("Foto apagada com sucesso.", "success");

        // Se o usuário apagou a última foto do álbum, fecha o modal automaticamente
        if (modalPhotos.length === 1) {
          handleCloseModal();
        }
      } catch (error) {
        showNotification(error.message, "error");
      }
    }
  };

  // --- MEMOIZAÇÃO E FILTROS ---

  // Agrupa a lista plana de fotos em objetos de Álbuns: { "Nome do Album": [foto1, foto2] }
  const albums = useMemo(() => {
    const grouped = gallery.reduce((acc, photo) => {
      const album = photo.album || 'Outras Fotos';
      if (!acc[album]) {
        acc[album] = [];
      }
      acc[album].push(photo);
      return acc;
    }, {});
    // Converte objeto em array para facilitar o .map() no render
    return Object.entries(grouped).map(([name, photos]) => ({ name, photos }));
  }, [gallery]);

  // Classes CSS dinâmicas para as abas de navegação
  const tabClasses = (tabName) => `flex items-center justify-center w-full px-4 py-3 font-semibold transition-all duration-300 border-b-2
    ${activeTab === tabName ? "border-sky-500 text-sky-500" : "border-transparent text-gray-500 hover:text-gray-800"}`;

  // --- RENDERIZAÇÃO ---
  return (
    <>
      <FormWrapper title="Gerir Galeria" icon={<Camera className="mr-2 text-sky-500" />}>
        
        {/* Navegação (Abas) */}
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

        {/* --- FORMULÁRIO DE CRIAÇÃO --- */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <MultiImageUpload label="Selecione as Imagens do Álbum" onChange={setFiles} maxFiles={20} />
            <FloatingLabelInput id="gallery-album-name" label="Nome do Novo Álbum" type="text" value={albumName} onChange={(e) => setAlbumName(e.target.value)} required />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button type="button" onClick={() => { resetForm(); setActiveTab("list"); }} className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600">
                Cancelar
              </button>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-sky-500 text-white p-3 rounded-md shadow-sm hover:bg-sky-600 transition-colors disabled:bg-gray-400">
                {isLoading ? <LoadingSpinner size="sm" /> : "Adicionar Álbum"}
              </button>
            </div>
          </form>
        )}

        {/* --- LISTAGEM DE ÁLBUNS --- */}
        {activeTab === 'list' && (
          <div className="animate-fade-in">
            {/* Campo de Busca */}
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

            {/* Renderização da Lista Filtrada */}
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
                        onView={handleViewAlbum}
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
      
      {/* Modal para gerenciar fotos individuais */}
      <GalleryModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        photos={modalPhotos}
        onDeleteImage={handleDeleteImage} 
      />
    </>
  );
};

export default GalleryFormFull;