// components/dashboard/TeamFormFull.jsx
import { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import { Users, Pencil, Trash2, PlusCircle } from "lucide-react";
import ImageUpload from "../ui/ImageUpload";
import LoadingSpinner from "../ui/LoadingSpinner";

const TeamFormFull = ({ team, fetchAllData, handleSave, handleDelete, showNotification }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing && !file) {
      showNotification("É obrigatório adicionar uma foto para um novo membro.", "error");
      return;
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
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditing(p); setName(p.name); setRole(p.role); setSubjects(p.subjects.join(", "));
    setBio(p.bio); setFile(null); setResetKey(prevKey => prevKey + 1);
    window.scrollTo(0, 0);
  };

  return (
    <FormWrapper title="Gerir Equipe" icon={<Users className="mr-2 text-purple-500" />}>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        
        {/* GRELHA REORGANIZADA PARA A ORDEM CORRETA 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Item 1: Nome Completo */}
          <FloatingLabelInput id="team-name" label="Nome Completo" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          
          {/* Item 2: Função */}
          <div className="relative">
            <select id="team-role" value={role} onChange={(e) => setRole(e.target.value)} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent peer appearance-none" required>
              <option value="Professor(a)">Professor(a)</option>
              <option value="Diretora">Diretora</option>
              <option value="Vice-Diretora">Vice-Diretora</option>
              <option value="Coordenador(a)">Coordenador(a)</option>
            </select>
            <label htmlFor="team-role" className="absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text top-[-10px] text-xs text-[#4455a3] bg-white px-1">Função</label>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          {/* Item 3: Matérias */}
          <FloatingLabelInput id="team-subjects" label="Matérias (separadas por vírgula)" type="text" value={subjects} onChange={(e) => setSubjects(e.target.value)} />
          
          {/* Item 4: Foto do Perfil */}
          <div className="pt-2">
            <ImageUpload key={resetKey} label="Foto do Perfil" onChange={setFile} existingImageUrl={editing?.photoUrl} />
          </div>
        </div>

        {/* Campo Biografia (largura total) */}
        <div className="relative">
          <textarea id="team-bio" placeholder=" " value={bio} onChange={(e) => setBio(e.target.value)} className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent peer" rows="3" required></textarea>
          <label htmlFor="team-bio" className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text ${bio ? 'top-[-10px] text-xs text-[#4455a3] bg-white px-1' : 'top-2 text-base'} peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#4455a3] peer-focus:bg-white peer-focus:px-1`}>
            Biografia
          </label>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-purple-500 text-white p-2 rounded-md shadow-sm hover:bg-purple-600 flex items-center justify-center space-x-2 disabled:bg-gray-400">
          {isLoading ? <LoadingSpinner size="sm"/> : <><PlusCircle size={18} /><span>{editing ? "Atualizar Perfil" : "Adicionar Perfil"}</span></>}
        </button>
        {editing && !isLoading && <button type="button" onClick={resetForm} className="w-full bg-gray-500 text-white p-2 rounded-md shadow-sm hover:bg-gray-600">Cancelar Edição</button>}
      </form>
      
      <h3 className="text-lg font-semibold border-t pt-4 mt-6">Membros da Equipe</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 mt-4">
        {team.length > 0 ? team.map((p) => (
          <div key={p._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
            <span className="font-semibold">{p.name} ({p.role})</span>
            <div className="space-x-2 flex items-center">
              <button onClick={() => handleEdit(p)} className="text-blue-500 p-2 rounded-full hover:bg-blue-100 transition-colors"><Pencil size={18} /></button>
              <button onClick={() => handleDelete("/api/team", fetchAllData)(p._id)} className="text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        )) : (
          <p className="text-gray-500 text-center py-4">Nenhum membro na equipe ainda.</p>
        )}
      </div>
    </FormWrapper>
  );
};

export default TeamFormFull;