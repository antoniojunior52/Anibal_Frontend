import React from "react";
import PageWrapper from "../ui/PageWrapper";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "../../App"; // Assuming API_URL is exported from App or moved to a config

const NewsDetailPage = ({ article, onBack }) => (
  <PageWrapper>
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <button
        onClick={onBack}
        className="mb-8 flex items-center font-semibold text-[#4455a3] hover:opacity-80 transition-all"
      >
        <ArrowLeft size={18} className="mr-2" />
        Voltar para todas as notícias
      </button>
      <img
        src={`${API_URL}${article.image}`}
        alt={article.title}
        className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-2xl mb-8"
      />
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        {article.title}
      </h1>
      <p className="text-gray-500 mb-8">
        {new Date(article.date).toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        })}
      </p>
      <div className="prose lg:prose-xl max-w-none">
        <p>{article.content}</p>
      </div>
    </div>
  </PageWrapper>
);

export default NewsDetailPage;
