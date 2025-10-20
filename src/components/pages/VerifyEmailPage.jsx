import React, { useState, useEffect } from "react";
import PageWrapper from "../ui/PageWrapper";
import LoadingSpinner from "../ui/LoadingSpinner";
import { MailCheck } from "lucide-react";

// ADICIONADO 'showNotification' para um melhor feedback ao utilizador
const VerifyEmailPage = ({ navigate, handleVerifyCode, handleResendCode, userEmail, showNotification }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // A função agora pode receber o código diretamente para auto-submissão
  const handleVerificationSubmit = async (eOrCode) => {
    // Previne o comportamento padrão se for um evento de formulário
    if (eOrCode && eOrCode.preventDefault) {
      eOrCode.preventDefault();
    }
    
    const finalCode = typeof eOrCode === 'string' ? eOrCode : code;

    if (finalCode.length < 6) {
      showNotification("O código deve ter 6 dígitos.", "error");
      return;
    }
    setLoading(true);
    try {
      // Passa o código final para a função de verificação
      await handleVerifyCode(finalCode);
    } catch (error) {
      // Erros já são tratados no App.js
    } finally {
      setLoading(false);
    }
  };

  const handleResendClick = async () => {
    setResendLoading(true);
    try {
      await handleResendCode();
      setResendCooldown(60);
    } catch (error) {
      // Erros já são tratados no App.js
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl text-center">
          <div>
            <MailCheck className="mx-auto h-12 w-12 text-[#4455a3]" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verifique seu E-mail
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enviamos um código de 6 dígitos para{" "}
              <strong className="font-medium text-gray-800">{userEmail || "seu e-mail"}</strong>.
              Por favor, insira-o abaixo.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleVerificationSubmit}>
            <div>
              <label htmlFor="verification-code" className="sr-only">
                Código de Verificação
              </label>
              <input
                id="verification-code"
                name="code"
                type="text"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  if (value.length <= 6) {
                    setCode(value);
                    // LÓGICA DE AUTO-SUBMISSÃO
                    if (value.length === 6) {
                      handleVerificationSubmit(value);
                    }
                  }
                }}
                maxLength="6"
                className="appearance-none rounded-md relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#4455a3] focus:border-[#4455a3] focus:z-10 sm:text-lg text-center tracking-[1em]"
                placeholder="------"
                required
                autoComplete="one-time-code"
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4455a3] shadow-md hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3a488a]"
                disabled={loading || code.length < 6}
                aria-label="Verificar Código"
              >
                {loading ? <LoadingSpinner size="sm" /> : "Verificar Código"}
              </button>
            </div>
          </form>

          <div className="text-sm text-center">
            <p className="text-gray-600">
              Não recebeu o código?{" "}
              <button
                type="button"
                onClick={handleResendClick}
                disabled={resendCooldown > 0 || resendLoading}
                className="font-medium text-[#4455a3] hover:text-[#3a488a] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Reenviar código de verificação"
              >
                {resendLoading 
                  ? "Enviando..." 
                  : resendCooldown > 0 
                    ? `Reenviar em ${resendCooldown}s` 
                    : "Reenviar código"}
              </button>
            </p>
             <button
                type="button"
                onClick={() => navigate("login")}
                className="mt-4 font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                &larr; Voltar para o Login
              </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default VerifyEmailPage;