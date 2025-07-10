// components/pages/LoginPage.jsx
import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import { Lock, Eye, EyeOff } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import LoadingSpinner from "../ui/LoadingSpinner"; // Importar o LoadingSpinner

const LoginPage = ({ navigate, showNotification, handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Iniciar carregamento
    try {
      await handleLogin(email, password, rememberMe);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setLoading(false); // Parar carregamento
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
          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit} aria-label="Formulário de Login"> {/* Adicionado para acessibilidade */}
            <FloatingLabelInput
              id="email-login"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <FloatingLabelInput
                id="password-login"
                label="Senha"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} // Rótulo para acessibilidade
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" aria-hidden="true" /> // Esconder ícone do leitor de tela
                ) : (
                  <EyeOff className="h-5 w-5" aria-hidden="true" /> // Esconder ícone do leitor de tela
                )}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <span className="mr-3 text-sm font-medium text-gray-900">
                  Lembrar de mim
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                    aria-label="Lembrar de mim" // Adicionado para acessibilidade
                  />
                  <div
                    className={`block w-10 h-6 rounded-full transition-colors ${
                      rememberMe ? "bg-[#4455a3]" : "bg-gray-200"
                    }`}
                    aria-hidden="true" // Esconder o visual do toggle do leitor de tela
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      rememberMe ? "translate-x-full" : ""
                    }`}
                    aria-hidden="true" // Esconder o visual do toggle do leitor de tela
                  ></div>
                </div>
              </label>
              <button
                type="button"
                onClick={() => navigate("forgot-password")}
                className="text-sm font-medium text-[#4455a3] hover:text-[#3a488a] transition-colors"
                aria-label="Esqueci a senha?" // Adicionado para acessibilidade
              >
                Esqueci a senha?
              </button>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4455a3] shadow-md hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1"
                disabled={loading} // Desabilitar botão enquanto carrega
                aria-label="Entrar na conta" // Adicionado para acessibilidade
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
            <p className="mt-2 text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <button
                onClick={() => navigate("register")}
                className="font-medium text-[#4455a3] hover:text-[#3a488a] transition-colors"
                aria-label="Criar uma nova conta" // Adicionado para acessibilidade
              >
                Crie uma aqui
              </button>
            </p>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
