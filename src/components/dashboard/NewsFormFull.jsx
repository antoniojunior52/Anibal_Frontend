// components/dashboard/NewsFormFull.jsx
import { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { FileText, Pencil, Trash2, PlusCircle } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput"; // Import FloatingLabelInput

const NewsFormFull = ({ news, fetchAllData, handleSave, handleDelete, showNotification, CustomFileInput }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(null);
  const [resetKey, setResetKey] = useState(0); // Novo estado para forçar o reset do CustomFileInput

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFile(null);
    setFileName("");
    setEditing(null);
    setResetKey(prevKey => prevKey + 1); // Incrementa a chave para forçar a remontagem do CustomFileInput
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      showNotification("Título e conteúdo são obrigatórios.", "error");
      return;
    }
    if (!editing && !file) {
      showNotification(
        "É obrigatório adicionar uma imagem para uma nova notícia.",
        "error"
      );
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) formData.append("file", file); // Changed from 'image' to 'file' for generic upload
    try {
      await handleSave("/api/news", fetchAllData)(formData, editing?._id);
      resetForm();
      showNotification("Notícia salva!", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setTitle(item.title);
    setContent(item.content);
    setFile(null);
    setFileName("");
    setResetKey(prevKey => prevKey + 1); // Também incrementa a chave ao editar para limpar o input de arquivo
    window.scrollTo(0, 0);
  };

  return (
    <FormWrapper
      title="Gerir Notícias"
      icon={<FileText className="mr-2 text-teal-500" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <FloatingLabelInput
          id="news-title"
          label="Título"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="relative">
          <textarea
            id="news-content"
            placeholder=""
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent
                       peer transition-all duration-200 ease-in-out"
            rows="4"
            required
          ></textarea>
          <label
            htmlFor="news-content"
            className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text
                       ${content ? 'top-[-10px] text-xs text-[#4455a3] bg-white px-1' : 'top-2 text-base'}
                       peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#4455a3] peer-focus:bg-white peer-focus:px-1
                       peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500`}
          >
            Conteúdo
          </label>
        </div>
        <CustomFileInput // Using CustomFileInput
          key={resetKey} // Adicionado a prop key aqui
          label="Imagem da Notícia"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
          }}
          accept="image/*"
          fileName={fileName}
        />
        <button
          type="submit"
          className="w-full bg-teal-500 text-white p-2 rounded-md shadow-sm hover:bg-teal-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2"
        >
          <PlusCircle size={18} />
          <span>{editing ? "Atualizar Notícia" : "Adicionar Notícia"}</span>
        </button>
        {editing && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full bg-gray-500 text-white p-2 rounded-md shadow-sm hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-1 mt-2"
          >
            Cancelar Edição
          </button>
        )}
      </form>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {news.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm"
          >
            <span className="font-semibold">{item.title}</span>
            <div className="space-x-2 flex items-center">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-500 p-2 rounded-full hover:bg-blue-100 transition-colors"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() =>
                  handleDelete("/api/news", fetchAllData)(item._id)
                }
                className="text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </FormWrapper>
  );
};

export default NewsFormFull;
