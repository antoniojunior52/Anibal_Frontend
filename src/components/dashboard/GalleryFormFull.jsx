// components/dashboard/GalleryFormFull.jsx
import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import { Camera, Trash2 } from "lucide-react";
import MultiImageUpload from "../ui/MultiImageUpload";
import LoadingSpinner from "../ui/LoadingSpinner";

const GalleryFormFull = ({ gallery, fetchAllData, handleSave, handleDelete, showNotification }) => {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      showNotification("Selecione pelo menos uma imagem.", "error");
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("caption", caption);
    files.forEach((file) => formData.append(`files`, file));

    try {
      await handleSave("/api/gallery", fetchAllData)(formData);
      setFiles([]);
      setCaption("");
      showNotification("Imagens adicionadas!", "success");
    } catch (error) {
      // A notificação de erro já é tratada dentro do handleSave
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper title="Gerir Galeria" icon={<Camera className="mr-2 text-sky-500" />}>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <MultiImageUpload 
          label="Imagens" 
          onChange={setFiles} 
          maxFiles={10} // Limite de 10 imagens por vez
        />
        <FloatingLabelInput 
          id="gallery-caption" 
          label="Legenda para o conjunto de imagens" 
          type="text" 
          value={caption} 
          onChange={(e) => setCaption(e.target.value)} 
          required 
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex justify-center items-center bg-sky-500 text-white p-2 rounded-md shadow-sm hover:bg-sky-600 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : "Adicionar Imagens"}
        </button>
      </form>

      <h3 className="text-lg font-semibold border-t pt-4 mt-6">Álbuns Existentes</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 mt-4">
        {gallery.length > 0 ? gallery.map((item) => (
          <div key={item._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
            <span className="font-medium text-gray-800">{item.caption}</span>
            <button 
              onClick={() => handleDelete("/api/gallery", fetchAllData)(item._id)} 
              className="text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors"
              aria-label={`Apagar álbum ${item.caption}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        )) : (
          <p className="text-gray-500 text-center py-4">Nenhum álbum na galeria ainda.</p>
        )}
      </div>
    </FormWrapper>
  );
};

export default GalleryFormFull;