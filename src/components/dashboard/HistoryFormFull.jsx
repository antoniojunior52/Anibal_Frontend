import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { Milestone, PlusCircle, List, Search } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import LoadingSpinner from "../ui/LoadingSpinner";
import HistoryTimelineItem from "./HistoryTimelineItem";

const HistoryFormFull = ({ history, fetchAllData, handleSave, handleDelete, showNotification }) => {
  // ... (toda a lógica do componente permanece a mesma)
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setYear(""); setTitle(""); setDescription(""); setEditing(null);
  };
  
  const handleAddNew = () => {
    resetForm();
    setActiveTab("form");
  };

  const handleEdit = (item) => {
    setEditing(item); setYear(item.year); setTitle(item.title);
    setDescription(item.description);
    setActiveTab("form");
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleSave("/api/history", fetchAllData)({ year, title, description }, editing?._id);
      resetForm();
      showNotification("Marco histórico salvo!", "success");
      setActiveTab("list");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const tabClasses = (tabName) => `flex items-center justify-center w-full px-4 py-3 font-semibold transition-all duration-300 border-b-2
    ${activeTab === tabName ? "border-yellow-500 text-black" : "border-transparent text-gray-500 hover:text-gray-800"}`;

  return (
    <FormWrapper title="Gerir História" icon={<Milestone className="mr-2 text-yellow-500" />}>
      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab("list")} className={tabClasses("list")}>
          <List size={18} className="mr-2" />
          Linha do Tempo ({history.length})
        </button>
        <button onClick={() => setActiveTab("form")} className={tabClasses("form")}>
          <PlusCircle size={18} className="mr-2" />
          {editing ? "Editar Marco" : "Adicionar Novo"}
        </button>
      </div>

      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <FloatingLabelInput id="history-year" label="Ano (ex: 2024)" type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
          <FloatingLabelInput id="history-title" label="Título do Marco" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="relative">
            <textarea id="history-description" placeholder=" " value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent peer" rows="3" required></textarea>
            <label htmlFor="history-description" className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text ${description ? 'top-[-10px] text-xs text-yellow-500 bg-white px-1' : 'top-2 text-base'} peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-yellow-500 peer-focus:bg-white peer-focus:px-1`}>Descrição</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* CORREÇÃO AQUI: 'text-white' alterado para 'text-black' */}
            <button type="button" onClick={() => { resetForm(); setActiveTab("list"); }} className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-yellow-500 text-black p-3 rounded-md shadow-sm hover:bg-yellow-600 transition-colors disabled:bg-gray-400 font-semibold">
              {isLoading ? <LoadingSpinner size="sm" /> : (editing ? "Atualizar Marco" : "Adicionar Marco")}
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
              placeholder="Buscar por ano, título ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
            />
          </div>
          
          {(() => {
            const sortedHistory = [...history].sort((a, b) => b.year - a.year);
            const filteredHistory = sortedHistory.filter(item => {
              const query = searchQuery.toLowerCase();
              return (
                item.year.toString().includes(query) ||
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
              );
            });

            if (filteredHistory.length > 0) {
              return (
                <div className="relative">
                  {filteredHistory.map((item) => (
                    <HistoryTimelineItem 
                      key={item._id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={() => handleDelete("/api/history", fetchAllData)(item._id)}
                    />
                  ))}
                </div>
              );
            }

            if (history.length > 0 && filteredHistory.length === 0) {
              return (
                <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg"><p className="text-gray-600 font-semibold">Nenhum marco encontrado</p></div>
              );
            }
            
            return (
              <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Nenhum marco histórico adicionado.</p>
                {/* CORREÇÃO AQUI: 'text-white' alterado para 'text-black' */}
                <button onClick={handleAddNew} className="mt-4 bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-yellow-600 transition-all">
                  <PlusCircle size={18} className="inline mr-2" />
                  Adicionar primeiro marco
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </FormWrapper>
  );
};

export default HistoryFormFull;