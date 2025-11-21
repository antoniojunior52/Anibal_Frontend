import React from "react";
import PageWrapper from "../ui/PageWrapper";
import { ServerCrash, Frown } from "lucide-react";

// Página genérica de Erro (404 ou 500)
const ErrorPage = ({ statusCode, message, navigate }) => {
  let title = "Ocorreu um Erro";
  let icon = <ServerCrash className="h-16 w-16 text-red-500" />;

  // Personaliza a mensagem e ícone se for erro 404 (Página não encontrada)
  if (statusCode === 404) {
    title = "Página Não Encontrada";
    icon = <Frown className="h-16 w-16 text-gray-500" />;
  }

  const defaultMessage = (
    statusCode === 404
      ? "Ups! Parece que o link que você seguiu está quebrado ou a página foi removida."
      : "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde."
  );

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        {/* Ícone do erro */}
        <div className="p-6 bg-red-100 rounded-full mb-6">
          {icon}
        </div>
        {/* Código e Título do erro */}
        <h1 className="text-6xl font-extrabold text-gray-800">{statusCode}</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-2">
          {title}
        </h2>
        {/* Mensagem descritiva */}
        <p className="text-gray-500 mt-4 max-w-md">
          {message || defaultMessage}
        </p>
        {/* Botão para voltar à Home */}
        <button
          onClick={() => navigate("home")}
          className="mt-8 px-6 py-3 bg-[#4455a3] text-white font-semibold rounded-lg shadow-md hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1"
        >
          Voltar para a Página Inicial
        </button>
      </div>
    </PageWrapper>
  );
};

export default ErrorPage;