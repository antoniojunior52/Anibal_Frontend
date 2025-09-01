import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import { Camera, Trash2, UploadCloud, X } from "lucide-react";

const GalleryFormFull = ({ gallery, fetchAllData, handleSave, handleDelete, showNotification }) => {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      showNotification("Selecione pelo menos uma imagem.", "error");
      return;
    }
    
    const formData = new FormData();
    formData.append("caption", caption);
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    try {
      await handleSave("/api/gallery", fetchAllData)(formData);
      setFiles([]);
      setCaption("");
      showNotification("Imagens adicionadas!", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };
  
  const handleRemoveFile = (fileNameToRemove) => {
    setFiles(files.filter(file => file.name !== fileNameToRemove));
  };

  return (
    <FormWrapper
      title="Gerir Galeria"
      icon={<Camera className="mr-2 text-sky-500" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Imagens
        </label>
        <div className="flex justify-center items-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col justify-center items-center w-full h-40 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex flex-col justify-center items-center pt-5 pb-6">
              <UploadCloud
                aria-hidden="true"
                className="mb-3 w-10 h-10 text-gray-400"
              />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        </div>
        {files.length > 0 && (
          <div className="mt-2 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
                <span className="text-sm text-gray-700">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
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
          Adicionar Imagens
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
