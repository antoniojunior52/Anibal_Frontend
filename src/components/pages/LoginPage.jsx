import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import { Lock, Eye, EyeOff } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import LoadingSpinner from "../ui/LoadingSpinner";

// Página de Login (Acesso à Área Restrita)
const LoginPage = ({ navigate, showNotification, handleLogin }) => {
  // Estados para os campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Alterna entre mostrar senha ou '***'
  const [rememberMe, setRememberMe] = useState(true); // Estado do botão "Lembrar de mim"
  const [loading, setLoading] = useState(false); // Controla o spinner no botão

  // Processa o envio do formulário
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia animação de carga
    try {
      // Chama a função global de login (passada via props)
      await handleLogin(email, password, rememberMe);
    } catch (error) {
      // A notificação de erro já é tratada dentro do handleLogin no App.js
    } finally {
      setLoading(false); // Para animação de carga
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Área de Gerenciamento
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Faça login para continuar
            </p>
          </div>
          
          {/* Formulário de Login */}
          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit} aria-label="Formulário de Login">
            <FloatingLabelInput
              id="email-login"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Campo de Senha com botão de mostrar/ocultar */}
            <div className="relative password-input-wrapper">
              <FloatingLabelInput
                id="password-login"
                label="Senha"
                type={showPassword ? "text" : "password"} // Muda o tipo do input dinamicamente
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Opções Extras: Lembrar de mim e Esqueci senha */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <span className="mr-3 text-sm font-medium text-gray-900">
                  Lembrar de mim
                </span>
                {/* Toggle Switch personalizado */}
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                    aria-label="Lembrar de mim"
                  />
                  <div
                    className={`block w-10 h-6 rounded-full transition-colors ${
                      rememberMe ? "bg-[#4455a3]" : "bg-gray-200"
                    }`}
                    aria-hidden="true"
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      rememberMe ? "translate-x-full" : ""
                    }`}
                    aria-hidden="true"
                  ></div>
                </div>
              </label>
              <button
                type="button"
                onClick={() => navigate("forgot-password")}
                className="text-sm font-medium text-[#4455a3] hover:text-[#3a488a] transition-colors"
                aria-label="Esqueci a senha?"
              >
                Esqueci a senha?
              </button>
            </div>
            
            {/* Botão de Entrar */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4455a3] shadow-md hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1"
                disabled={loading} // Desabilita cliques duplos
                aria-label="Entrar na conta"
              >
                {loading ? <LoadingSpinner size="sm" message="" /> : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3" aria-hidden="true">
                      <Lock className="h-5 w-5 text-[#fcc841]" />
                    </span>
                    Entrar
                  </>
                )}
              </button>
            </div>
            {/* Botão de Registro (Comentado/Desativado no código original) */}
            {/* <p className="mt-2 text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <button
                onClick={() => navigate("register")}
                className="font-medium text-[#4455a3] hover:text-[#3a488a] transition-colors"
                aria-label="Criar uma nova conta"
              >
                Crie uma aqui
              </button>
            </p> */}
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;