import { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { FileText, PlusCircle, List, Search } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import ImageUpload from "../ui/ImageUpload";
import LoadingSpinner from "../ui/LoadingSpinner";
import NewsCard from "./NewsCard";

const NewsFormFull = ({ news, fetchAllData, handleSave, handleDelete, showNotification }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [editing, setEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const resetForm = () => {
    setTitle(""); setContent(""); setExternalLink("");
    setFile(null); setEditing(null); setResetKey(prevKey => prevKey + 1);
  };

  const handleAddNew = () => {
    resetForm();
    setActiveTab("form");
  };

  const handleEdit = (item) => {
    setEditing(item); setTitle(item.title); setContent(item.content);
    setExternalLink(item.externalLink || ""); setFile(null);
    setResetKey(prevKey => prevKey + 1);
    setActiveTab("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      showNotification("Título e conteúdo são obrigatórios.", "error"); return;
    }
    if (!editing && !file) {
      showNotification("É obrigatório adicionar uma imagem para uma nova notícia.", "error"); return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("externalLink", externalLink);
    if (file) formData.append("file", file);
    
    try {
      await handleSave("/api/news", fetchAllData)(formData, editing?._id);
      resetForm();
      showNotification("Notícia salva!", "success");
      setActiveTab("list");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const tabClasses = (tabName) => `flex items-center justify-center w-full px-4 py-3 font-semibold transition-all duration-300 border-b-2
    ${activeTab === tabName ? "border-[#4455a3] text-[#4455a3]" : "border-transparent text-gray-500 hover:text-gray-800"}`;

  return (
    <FormWrapper title="Gerenciar Notícias" icon={<FileText className="mr-2 text-teal-500" />}>
      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab("list")} className={tabClasses("list")}>
          <List size={18} className="mr-2" />
          Notícias Publicadas ({news.length})
        </button>
        <button onClick={() => setActiveTab("form")} className={tabClasses("form")}>
          <PlusCircle size={18} className="mr-2" />
          {editing ? "Editar Notícia" : "Adicionar Nova"}
        </button>
      </div>

      {activeTab === "form" && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <FloatingLabelInput id="news-title" label="Título" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <FloatingLabelInput id="news-link" label="Link Externo (opcional)" type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} />
          <div className="relative">
            <textarea id="news-content" placeholder=" " value={content} onChange={(e) => setContent(e.target.value)} className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent peer" rows="4" required></textarea>
            <label htmlFor="news-content" className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text ${content ? 'top-[-10px] text-xs text-[#4455a3] bg-white px-1' : 'top-2 text-base'} peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#4455a3] peer-focus:bg-white peer-focus:px-1`}>Conteúdo</label>
          </div>
          <ImageUpload key={resetKey} label="Imagem da Notícia" onChange={setFile} existingImageUrl={editing?.imageUrl} isLoading={isLoading}/>
          <div className="flex flex-col sm:flex-row gap-4">
            <button type="button" onClick={() => { resetForm(); setActiveTab("list"); }} className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="w-full bg-teal-500 text-white p-3 rounded-md shadow-sm hover:bg-teal-600 flex items-center justify-center space-x-2 disabled:bg-gray-400 transition-colors">
              {isLoading ? <LoadingSpinner size="sm"/> : <span>{editing ? "Atualizar Notícia" : "Salvar Notícia"}</span>}
            </button>
          </div>
        </form>
      )}

      {activeTab === "list" && (
        <div className="animate-fade-in">
          <div className="relative mb-8">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Buscar por título ou conteúdo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent transition"
            />
          </div>

          {(() => {
            const filteredNews = news.filter(item =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.content.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredNews.length > 0) {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredNews.map((item) => (
                    <NewsCard 
                      key={item._id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={(id) => handleDelete("/api/news", fetchAllData)(id)}
                    />
                  ))}
                </div>
              );
            }
            
            if (news.length > 0 && filteredNews.length === 0) {
              return (
                <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                  <p className="text-gray-600 font-semibold">Nenhum resultado encontrado</p>
                  <p className="text-gray-500 mt-2">Tente um termo de busca diferente.</p>
                </div>
              );
            }

            return (
              <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Nenhuma notícia publicada ainda.</p>
                <button 
                  onClick={handleAddNew}
                  className="mt-4 bg-teal-500 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-teal-600 transition-all"
                >
                  <PlusCircle size={18} className="inline mr-2" />
                  Criar a primeira notícia
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </FormWrapper>
  );
};

export default NewsFormFull;