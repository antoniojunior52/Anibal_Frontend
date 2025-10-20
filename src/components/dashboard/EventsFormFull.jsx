import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { PartyPopper, PlusCircle, List, Search } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import LoadingSpinner from "../ui/LoadingSpinner";
import EventCard from "./EventCard"; // Importa o novo componente de Card

const EventsFormFull = ({ events, fetchAllData, handleSave, handleDelete, showNotification }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setDate(""); setTitle(""); setDescription(""); setEditing(null);
  };

  const handleAddNew = () => {
    resetForm();
    setActiveTab("form");
  };
  
  const handleEdit = (item) => {
    setEditing(item);
    setDate(item.date.split("T")[0]);
    setTitle(item.title);
    setDescription(item.description);
    setActiveTab("form");
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleSave("/api/events", fetchAllData)({ date, title, description }, editing?._id);
      resetForm();
      showNotification("Evento salvo!", "success");
      setActiveTab("list");
    } catch (e) {
      showNotification(e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const tabClasses = (tabName) => `flex items-center justify-center w-full px-4 py-3 font-semibold transition-all duration-300 border-b-2
    ${activeTab === tabName ? "border-pink-500 text-pink-500" : "border-transparent text-gray-500 hover:text-gray-800"}`;

  return (
    <FormWrapper title="Gerir Eventos" icon={<PartyPopper className="mr-2 text-pink-500" />}>
      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab("list")} className={tabClasses("list")}>
          <List size={18} className="mr-2" />
          Próximos Eventos ({events.length})
        </button>
        <button onClick={() => setActiveTab("form")} className={tabClasses("form")}>
          <PlusCircle size={18} className="mr-2" />
          {editing ? "Editar Evento" : "Adicionar Novo"}
        </button>
      </div>

      {activeTab === "form" && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <FloatingLabelInput id="event-date" label="Data do Evento" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <FloatingLabelInput id="event-title" label="Título do Evento" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="relative">
            <textarea id="event-description" placeholder=" " value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent peer" rows="3" required></textarea>
            <label htmlFor="event-description" className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text ${description ? 'top-[-10px] text-xs text-pink-500 bg-white px-1' : 'top-2 text-base'} peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-pink-500 peer-focus:bg-white peer-focus:px-1`}>Descrição</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-pink-500 text-white p-3 rounded-md shadow-sm hover:bg-pink-600 transition-colors disabled:bg-gray-400">
              {isLoading ? <LoadingSpinner size="sm" /> : (editing ? "Atualizar Evento" : "Adicionar Evento")}
            </button>
            <button type="button" onClick={() => { resetForm(); setActiveTab("list"); }} className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600">
              Cancelar
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
              placeholder="Buscar por título ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
            />
          </div>

          {(() => {
            const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
            const filteredEvents = sortedEvents.filter(item =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredEvents.length > 0) {
              return (
                <div className="space-y-4">
                  {filteredEvents.map((item) => (
                    <EventCard 
                      key={item._id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={() => handleDelete("/api/events", fetchAllData)(item._id)}
                    />
                  ))}
                </div>
              );
            }
            
            if (events.length > 0 && filteredEvents.length === 0) {
              return (
                <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                  <p className="text-gray-600 font-semibold">Nenhum evento encontrado</p>
                  <p className="text-gray-500 mt-2">Tente um termo de busca diferente.</p>
                </div>
              );
            }

            return (
              <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Nenhum evento agendado.</p>
                <button 
                  onClick={handleAddNew}
                  className="mt-4 bg-pink-500 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-pink-600 transition-all"
                >
                  <PlusCircle size={18} className="inline mr-2" />
                  Agendar primeiro evento
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </FormWrapper>
  );
};

export default EventsFormFull;