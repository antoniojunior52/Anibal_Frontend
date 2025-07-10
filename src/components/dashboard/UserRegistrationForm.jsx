// components/dashboard/UserRegistrationForm.jsx
import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { UserPlus } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput"; // Import FloatingLabelInput

const UserRegistrationForm = ({ handleRegisterByAdmin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Professor(a)");
  const [isSecretaria, setIsSecretaria] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("Professor(a)");
    setIsSecretaria(false);
    setIsAdmin(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegisterByAdmin({
        name,
        email,
        password,
        role,
        isSecretaria,
        isAdmin,
      });
      resetForm();
    } catch (error) {
      // The error is already notified by handleRegisterByAdmin
    }
  };

  return (
    <FormWrapper
      title="Cadastrar Novo Utilizador"
      icon={<UserPlus className="mr-2 text-[#4455a3]" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingLabelInput
          id="register-admin-name"
          label="Nome Completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FloatingLabelInput
          id="register-admin-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FloatingLabelInput
          id="register-admin-password"
          label="Senha Provisória"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="relative">
          <select
            id="register-admin-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent
                       peer transition-all duration-200 ease-in-out appearance-none pr-8"
          >
            <option value="Professor(a)">Professor(a)</option>
            <option value="Secretaria">Secretaria</option>
            <option value="Coordenação">Coordenação</option>
            <option value="Diretora">Diretora</option>
            <option value="Admin">Admin</option>
          </select>
          <label
            htmlFor="register-admin-role"
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
        <div className="flex items-center space-x-6 pt-2">
          <label className="flex items-center cursor-pointer">
            <span className="mr-3 text-sm font-medium text-gray-900">
              Secretaria
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={isSecretaria}
                onChange={(e) => setIsSecretaria(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`block w-10 h-6 rounded-full transition-colors ${
                  isSecretaria ? "bg-[#4455a3]" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  isSecretaria ? "translate-x-full" : ""
                }`}
              ></div>
            </div>
          </label>
          <label className="flex items-center cursor-pointer">
            <span className="mr-3 text-sm font-medium text-gray-900">
              Admin
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`block w-10 h-6 rounded-full transition-colors ${
                  isAdmin ? "bg-[#4455a3]" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  isAdmin ? "translate-x-full" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-[#4455a3] text-white p-2 rounded-md shadow-sm hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1"
        >
          Cadastrar Utilizador
        </button>
      </form>
    </FormWrapper>
  );
};

export default UserRegistrationForm;
