import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { Megaphone, PlusCircle, List, Search } from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";
import NoticeItem from "./NoticeItem";

const NoticeFormFull = ({ notices, fetchAllData, handleSave, handleDelete, showNotification, user }) => {
  // ... (toda a lógica do componente permanece a mesma)
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setContent("");
  };
  
  const handleAddNew = () => {
    resetForm();
    setActiveTab("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleSave("/api/notices", fetchAllData)({ content });
      resetForm();
      showNotification("Recado publicado com sucesso!", "success");
      setActiveTab("list");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const tabClasses = (tabName) => `flex items-center justify-center w-full px-4 py-3 font-semibold transition-all duration-300 border-b-2
    ${activeTab === tabName ? "border-[#ec9c30] text-black" : "border-transparent text-gray-500 hover:text-gray-800"}`;

  return (
    <FormWrapper title="Gerir Recados do Dia" icon={<Megaphone className="mr-2 text-[#ec9c30]" />}>
      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab("list")} className={tabClasses("list")}>
          <List size={18} className="mr-2" />
          Recados Atuais ({notices.length})
        </button>
        <button onClick={() => setActiveTab("form")} className={tabClasses("form")}>
          <PlusCircle size={18} className="mr-2" />
          Publicar Novo Recado
        </button>
      </div>

      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div className="relative">
            <textarea id="notice-content" placeholder=" " value={content} onChange={(e) => setContent(e.target.value)} className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ec9c30] focus:border-transparent peer" rows="5" required maxLength="500"></textarea>
            <label htmlFor="notice-content" className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text ${content ? 'top-[-10px] text-xs text-[#ec9c30] bg-white px-1' : 'top-2 text-base'} peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#ec9c30] peer-focus:bg-white peer-focus:px-1`}>
              Escreva o seu recado aqui...
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* CORREÇÃO AQUI: 'text-white' alterado para 'text-black' */}
            <button type="button" onClick={() => setActiveTab("list")} className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600">
              Cancelar
            </button>
             <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-[#ec9c30] text-black p-3 rounded-md shadow-sm hover:bg-[#d68a2a] transition-colors disabled:bg-gray-400 font-semibold">
                {isLoading ? <LoadingSpinner size="sm" /> : 'Publicar Recado'}
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
            <input type="text" placeholder="Buscar no conteúdo dos recados..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ec9c30] focus:border-transparent transition" />
          </div>
          
          {(() => {
            const sortedNotices = [...notices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const filteredNotices = sortedNotices.filter(notice => notice.content.toLowerCase().includes(searchQuery.toLowerCase()));

            if (filteredNotices.length > 0) {
              return (
                <div className="space-y-4">
                  {filteredNotices.map((notice) => (
                    <NoticeItem 
                      key={notice._id}
                      notice={notice}
                      user={user}
                      onDelete={() => handleDelete("/api/notices", fetchAllData)(notice._id)}
                    />
                  ))}
                </div>
              );
            }

            if (notices.length > 0 && filteredNotices.length === 0) {
              return (<div className="text-center py-10 px-4 border-2 border-dashed rounded-lg"><p className="text-gray-600 font-semibold">Nenhum recado encontrado</p></div>);
            }
            
            return (
              <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Nenhum recado publicado.</p>
                {/* CORREÇÃO AQUI: 'text-white' alterado para 'text-black' */}
                <button onClick={handleAddNew} className="mt-4 bg-[#ec9c30] text-black font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-[#d68a2a] transition-all">
                  <PlusCircle size={18} className="inline mr-2" />
                  Publicar primeiro recado
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </FormWrapper>
  );
};

export default NoticeFormFull;