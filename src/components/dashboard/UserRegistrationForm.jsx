import React, { useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

// Componente de Formulário para Criar Usuários (Admin)
// Possui verificação de disponibilidade de e-mail
const UserRegistrationForm = ({ handleRegisterByAdmin, apiService }) => {
  // Estados dos campos do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Professor(a)");
  const [isSecretaria, setIsSecretaria] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para feedback visual da checagem de email
  const [emailCheckStatus, setEmailCheckStatus] = useState('idle'); // idle, checking, valid, invalid
  const [emailCheckMessage, setEmailCheckMessage] = useState('');

  // Limpa o formulário após sucesso
  const resetForm = () => {
    setName(""); setEmail("");
    setRole("Professor(a)"); setIsSecretaria(false); setIsAdmin(false);
    setEmailCheckStatus('idle');
    setEmailCheckMessage('');
  };

  // Verifica se o e-mail está disponível na API quando o usuário sai do campo
  const handleEmailBlur = async () => {
    // Se estiver vazio ou inválido, reseta o status
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailCheckStatus('idle');
      return; 
    }
    
    setEmailCheckStatus('checking');
    setEmailCheckMessage('');
    
    try {
      await apiService.post("/api/auth/check-email", { email });
      setEmailCheckStatus('valid');
      setEmailCheckMessage('E-mail disponível!');
    } catch (error) {
      setEmailCheckStatus('invalid');
      setEmailCheckMessage(error.message || 'Erro ao verificar e-mail.');
    }
  };

  // Envia o cadastro
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Impede envio se o e-mail for inválido na checagem
    if (emailCheckStatus === 'invalid') {
      return; 
    }
    
    setIsLoading(true);
    try {
      // Envia os dados. A flag de verificação manual foi removida pois não é mais necessária.
      await handleRegisterByAdmin({ 
        name, 
        email, 
        role, 
        isSecretaria, 
        isAdmin
      });
      resetForm();
    } catch (error) {
      // Erro já tratado no pai
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in pt-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingLabelInput id="register-admin-name" label="Nome Completo" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        
        {/* Campo de E-mail com ícones de status */}
        <div>
          <FloatingLabelInput 
            id="register-admin-email" 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailCheckStatus('idle'); // Reseta checagem ao digitar
              setEmailCheckMessage('');
            }}
            onBlur={handleEmailBlur} // Dispara checagem ao sair do campo
            required 
          />
          {/* Feedback visual abaixo do input */}
          <div className="h-5 mt-1 ml-1 text-sm">
            {emailCheckStatus === 'checking' && (
              <span className="flex items-center text-gray-500 animate-pulse">
                <Loader2 className="animate-spin h-4 w-4 mr-1" /> Verificando...
              </span>
            )}
            {emailCheckStatus === 'valid' && (
              <span className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" /> {emailCheckMessage}
              </span>
            )}
            {emailCheckStatus === 'invalid' && (
              <span className="flex items-center text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" /> {emailCheckMessage}
              </span>
            )}
          </div>
        </div>
        
        {/* Seleção de Cargo */}
        <div>
          <label htmlFor="register-admin-role" className="block text-sm font-medium text-gray-700 mb-1">Função</label>
          <div className="relative">
            <select id="register-admin-role" value={role} onChange={(e) => setRole(e.target.value)} className="block w-full px-3 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent appearance-none">
              <option value="Professor(a)">Professor(a)</option>
              <option value="Secretaria">Secretaria</option>
              <option value="Coordenação">Coordenação</option>
              <option value="Diretora">Diretora</option>
              <option value="Vice-Diretora">Vice-Diretora</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        
        {/* Permissões Extras */}
        <div className="space-y-4 pt-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium text-gray-900">Acesso de Secretaria</span>
            <div className="relative">
              <input type="checkbox" checked={isSecretaria} onChange={(e) => setIsSecretaria(e.target.checked)} className="sr-only" />
              <div className={`block w-10 h-6 rounded-full transition-colors ${isSecretaria ? "bg-[#4455a3]" : "bg-gray-200"}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isSecretaria ? "translate-x-full" : ""}`}></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium text-gray-900">Acesso de Admin</span>
            <div className="relative">
              <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="sr-only" />
              <div className={`block w-10 h-6 rounded-full transition-colors ${isAdmin ? "bg-[#4455a3]" : "bg-gray-200"}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isAdmin ? "translate-x-full" : ""}`}></div>
            </div>
          </label>
        </div>
        
        {/* Botão de Cadastro */}
        <button 
          type="submit" 
          disabled={isLoading || emailCheckStatus === 'checking' || emailCheckStatus === 'invalid'} 
          className="w-full flex justify-center items-center bg-[#4455a3] text-white p-3 rounded-md shadow-sm hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : "Cadastrar Utilizador"}
        </button>
      </form>
    </div>
  );
};

export default UserRegistrationForm;