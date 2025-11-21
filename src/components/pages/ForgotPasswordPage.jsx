import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import { MailQuestion } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import LoadingSpinner from "../ui/LoadingSpinner";

// Página de Recuperação de Senha
const ForgotPasswordPage = ({ navigate, showNotification, apiService }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Controla estado do botão de enviar

  // Lida com o envio do formulário
  const handleForgotPassword = async (e) => {
    e.preventDefault(); // Evita recarregamento da página
    setLoading(true); // Ativa loading
    try {
      // Faz a requisição POST para a API
      const { msg } = await apiService.post("/api/auth/forgot-password", {
        email,
      });
      showNotification(msg, "success"); // Mostra sucesso
      navigate("login"); // Redireciona para login
    } catch (error) {
      showNotification(error.message, "error"); // Mostra erro
    } finally {
      setLoading(false); // Desativa loading independente do resultado
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Recuperar Senha
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Insira o seu e-mail para receber o link de recuperação.
            </p>
          </div>
          
          {/* Formulário */}
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword} aria-label="Formulário de Recuperação de Senha">
            <FloatingLabelInput
              id="email-forgot"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4455a3] shadow-md hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1"
                disabled={loading} // Bloqueia cliques múltiplos
                aria-label="Enviar Link de Recuperação"
              >
                {/* Se estiver carregando, mostra Spinner, senão mostra texto e ícone */}
                {loading ? <LoadingSpinner size="sm" message="" /> : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <MailQuestion className="h-5 w-5 text-[#fcc841]" />
                    </span>
                    Enviar Link de Recuperação
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;