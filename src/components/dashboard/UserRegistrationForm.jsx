import React, { useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import FloatingLabelInput from "../ui/FloatingLabelInput";

const UserRegistrationForm = ({ handleRegisterByAdmin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Professor(a)");
  const [isSecretaria, setIsSecretaria] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setName(""); setEmail(""); setPassword("");
    setRole("Professor(a)"); setIsSecretaria(false); setIsAdmin(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleRegisterByAdmin({ name, email, password, role, isSecretaria, isAdmin });
      resetForm();
    } catch (error) {
      // O erro já é notificado pela função pai
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in pt-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingLabelInput id="register-admin-name" label="Nome Completo" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <FloatingLabelInput id="register-admin-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <FloatingLabelInput id="register-admin-password" label="Senha Provisória" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        <div>
          <label htmlFor="register-admin-role" className="block text-sm font-medium text-gray-700 mb-1">Função</label>
          <div className="relative">
            <select id="register-admin-role" value={role} onChange={(e) => setRole(e.target.value)} className="block w-full px-3 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent appearance-none">
              <option value="Professor(a)">Professor(a)</option>
              <option value="Secretaria">Secretaria</option>
              <option value="Coordenação">Coordenação</option>
              <option value="Diretora">Diretora</option>
              {/* AQUI a nova opção foi adicionada */}
              <option value="Vice-Diretora">Vice-Diretora</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-8 pt-2">
          <label className="flex items-center cursor-pointer">
            <span className="mr-3 text-sm font-medium text-gray-900">Acesso de Secretaria</span>
            <div className="relative">
              <input type="checkbox" checked={isSecretaria} onChange={(e) => setIsSecretaria(e.target.checked)} className="sr-only" />
              <div className={`block w-10 h-6 rounded-full transition-colors ${isSecretaria ? "bg-[#4455a3]" : "bg-gray-200"}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isSecretaria ? "translate-x-full" : ""}`}></div>
            </div>
          </label>
          <label className="flex items-center cursor-pointer">
            <span className="mr-3 text-sm font-medium text-gray-900">Acesso de Admin</span>
            <div className="relative">
              <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="sr-only" />
              <div className={`block w-10 h-6 rounded-full transition-colors ${isAdmin ? "bg-[#4455a3]" : "bg-gray-200"}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isAdmin ? "translate-x-full" : ""}`}></div>
            </div>
          </label>
        </div>
        
        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-[#4455a3] text-white p-3 rounded-md shadow-sm hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1 font-semibold disabled:bg-gray-400">
          {isLoading ? <LoadingSpinner size="sm" /> : "Cadastrar Utilizador"}
        </button>
      </form>
    </div>
  );
};

export default UserRegistrationForm;