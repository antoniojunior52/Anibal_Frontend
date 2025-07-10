// components/pages/NotFoundPage.jsx
import React from "react";
import PageWrapper from "../ui/PageWrapper";
import { ServerCrash } from "lucide-react";

const NotFoundPage = ({ message, navigate }) => (
  <PageWrapper>
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="p-6 bg-red-100 rounded-full mb-6">
        <ServerCrash className="h-16 w-16 text-red-500" />
      </div>
      <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-2">
        Página Não Encontrada
      </h2>
      <p className="text-gray-500 mt-4 max-w-md">
        {message ||
          "Ups! Parece que o link que você seguiu está quebrado ou a página foi removida."}
      </p>
      <button
        onClick={() => navigate("home")}
        className="mt-8 px-6 py-3 bg-[#4455a3] text-white font-semibold rounded-lg shadow-md hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1"
      >
        Voltar para a Página Inicial
      </button>
    </div>
  </PageWrapper>
);

export default NotFoundPage;
