// components/dashboard/TeamFormFull.jsx
import { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import FloatingLabelInput from "../ui/FloatingLabelInput"; // Import FloatingLabelInput
import { Users, Pencil, Trash2, PlusCircle } from "lucide-react";

const TeamFormFull = ({ team, fetchAllData, handleSave, handleDelete, showNotification, CustomFileInput }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Professor(a)");
  const [subjects, setSubjects] = useState("");
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(null);
  const [resetKey, setResetKey] = useState(0); // Novo estado para forçar o reset do CustomFileInput

  const resetForm = () => {
    setName("");
    setRole("Professor(a)");
    setSubjects("");
    setBio("");
    setFile(null);
    setFileName("");
    setEditing(null);
    setResetKey(prevKey => prevKey + 1); // Incrementa a chave para forçar a remontagem do CustomFileInput
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing && !file) {
      showNotification(
        "É obrigatório adicionar uma foto para um novo membro.",
        "error"
      );
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("subjects", subjects);
    formData.append("bio", bio);
    if (file) formData.append("file", file); // Changed from 'photo' to 'file' for generic upload
    try {
      await handleSave("/api/team", fetchAllData)(formData, editing?._id);
      resetForm();
      showNotification("Perfil salvo!", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleEdit = (p) => {
    setEditing(p);
    setName(p.name);
    setRole(p.role);
    setSubjects(p.subjects.join(", "));
    setBio(p.bio);
    setFile(null);
    setFileName("");
    setResetKey(prevKey => prevKey + 1); // Também incrementa a chave ao editar para limpar o input de arquivo
    window.scrollTo(0, 0);
  };

  return (
    <FormWrapper
      title="Gerir Equipe"
      icon={<Users className="mr-2 text-purple-500" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabelInput
            id="team-name"
            label="Nome Completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="relative">
            <select
              id="team-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent
                         peer transition-all duration-200 ease-in-out appearance-none pr-8"
              required
            >
              <option value="Professor(a)">Professor(a)</option>
              <option value="Diretora">Diretora</option>
              <option value="Coordenador(a)">Coordenador(a)</option>
            </select>
            <label
              htmlFor="team-role"
              className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text
                         ${role ? 'top-[-10px] text-xs text-[#4455a3] bg-white px-1' : 'top-2 text-base'}
                         peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#4455a3] peer-focus:bg-white peer-focus:px-1`}
            >
              Função
            </label>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <FloatingLabelInput
            id="team-subjects"
            label="Matérias (separadas por vírgula)"
            type="text"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
          />
          <CustomFileInput // Using CustomFileInput
            key={resetKey} // Adicionado a prop key aqui
            label="Foto do Perfil"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setFileName(e.target.files[0].name);
            }}
            accept="image/*"
            fileName={fileName}
          />
        </div>
        <div className="relative">
          <textarea
            id="team-bio"
            placeholder=""
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent
                       peer transition-all duration-200 ease-in-out"
            rows="3"
            required
          ></textarea>
          <label
            htmlFor="team-bio"
            className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text
                       ${bio ? 'top-[-10px] text-xs text-[#4455a3] bg-white px-1' : 'top-2 text-base'}
                       peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#4455a3] peer-focus:bg-white peer-focus:px-1
                       peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500`}
          >
            Biografia
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-2 rounded-md shadow-sm hover:bg-purple-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2"
        >
          <PlusCircle size={18} />
          <span>{editing ? "Atualizar Perfil" : "Adicionar Perfil"}</span>
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
        {team.map((p) => (
          <div
            key={p._id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm"
          >
            <span className="font-semibold">
              {p.name} ({p.role})
            </span>
            <div className="space-x-2 flex items-center">
              <button onClick={() => handleEdit(p)} className="text-blue-500 p-2 rounded-full hover:bg-blue-100 transition-colors">
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete("/api/team", fetchAllData)(p._id)}
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

export default TeamFormFull;
