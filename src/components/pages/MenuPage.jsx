import React from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import AnimatedCard from "../ui/AnimatedCard";
import { Download } from "lucide-react";
import { API_URL } from "../../App"; 

// Página do Cardápio Escolar (Exibe PDF em iframe)
const MenuPage = ({ menuUrl }) => (
  <PageWrapper>
    <PageTitle
      title="Cardápio Escolar"
      subtitle="Alimentação saudável e balanceada para os nossos alunos."
    />
    <div className="container mx-auto max-w-5xl px-4 pb-12 flex justify-center">
      <AnimatedCard className="w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 transform hover:-translate-y-2 transition-transform duration-300 border-t-4 border-[#ec9c30]">
          
          {/* Área de visualização do PDF */}
          <div className="w-full h-[60vh] md:h-[75vh] bg-gray-100 rounded-lg overflow-hidden mb-6 shadow-inner">
            {menuUrl ? (
              <iframe
                src={`${API_URL}${menuUrl}`}
                className="w-full h-full border-0"
                title="Cardápio PDF"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                Nenhum cardápio disponível no momento.
              </div>
            )}
          </div>
          
          {/* Botão de Download */}
          <div className="text-center">
            <a
              href={menuUrl ? `${API_URL}${menuUrl}` : "#"}
              download="cardapio_escolar.pdf"
              className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#ec9c30] shadow-md hover:bg-[#d68a2a] transition-all duration-300 transform hover:-translate-y-1 ${!menuUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
              target="_blank" 
              rel="noopener noreferrer" 
              aria-disabled={!menuUrl}
            >
              <Download className="mr-3" size={20} />
              Baixar Cardápio (PDF)
            </a>
          </div>
        </div>
      </AnimatedCard>
    </div>
  </PageWrapper>
);

export default MenuPage;