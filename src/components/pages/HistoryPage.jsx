import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import AnimatedCard from "../ui/AnimatedCard";
import Pagination from "../ui/Pagination"; // Importar o componente de Paginação

const HistoryPage = ({ history }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Definir quantos itens do histórico por página

  // Calcular itens para a página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHistoryItems = history.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <PageWrapper>
      <PageTitle
        title="Nossa História"
        subtitle="Uma jornada de dedicação, crescimento e sucesso."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative before:content-[''] before:absolute before:left-1/2 before:top-0 before:h-full before:w-1 before:bg-[#4455a3]/30 before:-translate-x-1/2" role="list"> {/* Adicionado role="list" */}
        {currentHistoryItems.length > 0 ? (
          currentHistoryItems.map((item, index) => (
            <div
              key={item._id}
              className={`flex items-center w-full mb-8 ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
              role="listitem" // Adicionado role="listitem"
            >
              <div
                className={`w-1/2 ${
                  index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                }`}
              >
                <AnimatedCard>
                  <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-[#4455a3]">
                    <p className="text-[#4455a3] font-bold text-lg mb-1">
                      {item.year}
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </AnimatedCard>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhum item do histórico encontrado.</p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </PageWrapper>
  );
};

export default HistoryPage;
