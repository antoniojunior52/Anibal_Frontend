import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import { Users, PlusCircle, List, Search } from "lucide-react";
import ImageUpload from "../ui/ImageUpload";
import LoadingSpinner from "../ui/LoadingSpinner";
import TeamMemberCard from "./TeamMemberCard";

const TeamFormFull = ({ team, fetchAllData, handleSave, handleDelete, showNotification }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Professor(a)");
  const [subjects, setSubjects] = useState("");
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setName(""); setRole("Professor(a)"); setSubjects(""); setBio("");
    setFile(null); setEditing(null); setResetKey(prevKey => prevKey + 1);
  };
  
  const handleAddNew = () => {
    resetForm();
    setActiveTab("form");
  };

  const handleEdit = (p) => {
    setEditing(p); setName(p.name); setRole(p.role); 
    setSubjects(p.subjects.join(", "));
    setBio(p.bio); setFile(null); setResetKey(prevKey => prevKey + 1);
    setActiveTab("form");
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing && !file) {
      showNotification("É obrigatório adicionar uma foto para um novo membro.", "error"); return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("subjects", subjects);
    formData.append("bio", bio);
    if (file) formData.append("file", file);
    try {
      await handleSave("/api/team", fetchAllData)(formData, editing?._id);
      resetForm();
      showNotification("Perfil salvo!", "success");
      setActiveTab("list");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const tabClasses = (tabName) => `flex items-center justify-center w-full px-4 py-3 font-semibold transition-all duration-300 border-b-2
    ${activeTab === tabName ? "border-purple-500 text-purple-500" : "border-transparent text-gray-500 hover:text-gray-800"}`;

  return (
    <FormWrapper title="Gerir Equipe" icon={<Users className="mr-2 text-purple-500" />}>
      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab("list")} className={tabClasses("list")}>
          <List size={18} className="mr-2" />
          Membros da Equipe ({team.length})
        </button>
        <button onClick={() => setActiveTab("form")} className={tabClasses("form")}>
          <PlusCircle size={18} className="mr-2" />
          {editing ? "Editar Membro" : "Adicionar Novo"}
        </button>
      </div>

      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 items-start">
            <FloatingLabelInput id="team-name" label="Nome Completo" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <div className="relative mt-1">
              <select id="team-role" value={role} onChange={(e) => setRole(e.target.value)} className="block w-full px-3 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none" required>
                <option value="Professor(a)">Professor(a)</option>
                <option value="Diretora">Diretora</option>
                <option value="Vice-Diretora">Vice-Diretora</option>
                <option value="Coordenador(a)">Coordenador(a)</option>
              </select>
              <label htmlFor="team-role" className="absolute left-3 text-gray-500 transition-all duration-200 ease-in-out bg-white px-1 cursor-text top-[-10px] text-xs text-purple-500">Função</label>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
            </div>
            <FloatingLabelInput id="team-subjects" label="Matérias (separadas por vírgula)" type="text" value={subjects} onChange={(e) => setSubjects(e.target.value)} />
            {/* CORREÇÃO: Alterado de 'editing?.photoUrl' para 'editing?.imageUrl' */}
            <div className="pt-2"><ImageUpload key={resetKey} label="Foto do Perfil" onChange={setFile} existingImageUrl={editing?.imageUrl} /></div>
          </div>
          <div className="relative">
            <textarea id="team-bio" placeholder=" " value={bio} onChange={(e) => setBio(e.target.value)} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent peer" rows="3" required></textarea>
            <label htmlFor="team-bio" className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text ${bio ? 'top-[-10px] text-xs text-purple-500 bg-white px-1' : 'top-2 text-base'} peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-purple-500 peer-focus:bg-white peer-focus:px-1`}>Biografia</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-purple-500 text-white p-3 rounded-md shadow-sm hover:bg-purple-600 transition-colors disabled:bg-gray-400 font-semibold">
              {isLoading ? <LoadingSpinner size="sm"/> : (editing ? "Atualizar Perfil" : "Adicionar Perfil")}
            </button>
            <button type="button" onClick={() => { resetForm(); setActiveTab("list"); }} className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600">Cancelar</button>
          </div>
        </form>
      )}

      {activeTab === 'list' && (
        <div className="animate-fade-in">
          <div className="relative mb-8">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Search className="h-5 w-5 text-gray-400" /></span>
            <input type="text" placeholder="Buscar por nome, função ou matéria..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" />
          </div>
          {(() => {
            const sortedTeam = [...team].sort((a, b) => a.name.localeCompare(b.name));
            const filteredTeam = sortedTeam.filter(p => {
              const query = searchQuery.toLowerCase();
              return (
                p.name.toLowerCase().includes(query) ||
                p.role.toLowerCase().includes(query) ||
                p.subjects.join(", ").toLowerCase().includes(query)
              );
            });
            if (filteredTeam.length > 0) {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredTeam.map(p => (
                    <TeamMemberCard key={p._id} member={p} onEdit={handleEdit} onDelete={() => handleDelete("/api/team", fetchAllData)(p._id)} />
                  ))}
                </div>
              );
            }
            if (team.length > 0 && filteredTeam.length === 0) {
              return (<div className="text-center py-10 px-4 border-2 border-dashed rounded-lg"><p className="text-gray-600 font-semibold">Nenhum membro encontrado</p></div>);
            }
            return (
              <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Nenhum membro na equipe ainda.</p>
                <button onClick={handleAddNew} className="mt-4 bg-purple-500 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-purple-600 transition-all">
                  <PlusCircle size={18} className="inline mr-2" />
                  Adicionar primeiro membro
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </FormWrapper>
  );
};

export default TeamFormFull;