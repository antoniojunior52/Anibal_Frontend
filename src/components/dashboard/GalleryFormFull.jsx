// components/dashboard/GalleryFormFull.jsx
import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import FloatingLabelInput from "../ui/FloatingLabelInput"; // Import FloatingLabelInput
import { Camera, Trash2 } from "lucide-react";

const GalleryFormFull = ({ gallery, fetchAllData, handleSave, handleDelete, showNotification, CustomFileInput }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [caption, setCaption] = useState("");
  const [resetKey, setResetKey] = useState(0); // Novo estado para forçar o reset do CustomFileInput

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showNotification("Selecione uma imagem.", "error");
      return;
    }
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", file); // Changed from 'image' to 'file' for generic upload
    try {
      await handleSave("/api/gallery", fetchAllData)(formData);
      setFile(null);
      setFileName("");
      setCaption("");
      setResetKey(prevKey => prevKey + 1); // Incrementa a chave para forçar a remontagem do CustomFileInput
      showNotification("Imagem adicionada!", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <FormWrapper
      title="Gerir Galeria"
      icon={<Camera className="mr-2 text-sky-500" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <CustomFileInput // Using CustomFileInput
          key={resetKey} // Adicionado a prop key aqui
          label="Imagem"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
          }}
          accept="image/*"
          fileName={fileName}
        />
        <FloatingLabelInput
          id="gallery-caption"
          label="Legenda"
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-sky-500 text-white p-2 rounded-md shadow-sm hover:bg-sky-600 transition-all duration-300 transform hover:-translate-y-1"
        >
          Adicionar Imagem
        </button>
      </form>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {gallery.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm"
          >
            <span>{item.caption}</span>
            <button
              onClick={() =>
                handleDelete("/api/gallery", fetchAllData)(item._id)
              }
              className="text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </FormWrapper>
  );
};

export default GalleryFormFull;
