import React, { useState, useMemo } from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import AnimatedCard from "../ui/AnimatedCard";
import Pagination from "../ui/Pagination";
import SearchBar from "../ui/SearchBar";
import { API_URL } from "../../App";

// Página de Lista de Notícias (com filtro e pesquisa)
const NewsPage = ({ news, navigate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Filtra as notícias em tempo real (por texto ou data) sem alterar o array original
  // O useMemo evita reprocessamento desnecessário se nada mudar
  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const newsDate = new Date(item.date);
      newsDate.setHours(0, 0, 0, 0); // Zera hora para comparar apenas a data
      
      const selectedFilterDate = filterDate ? new Date(filterDate) : null;
      if (selectedFilterDate) {
        selectedFilterDate.setHours(0, 0, 0, 0);
      }
      
      // Critérios de filtro
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !selectedFilterDate || newsDate >= selectedFilterDate;
      
      return matchesSearch && matchesDate;
    });
  }, [news, searchTerm, filterDate]);

  // Lógica de paginação
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  // Handlers de interação
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Volta para a página 1 ao pesquisar
  };
  
  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
    setCurrentPage(1); // Volta para a página 1 ao filtrar
  };

  return (
    <PageWrapper>
      <PageTitle
        title="Notícias e Comunicados"
        subtitle="Acompanhe os últimos acontecimentos da nossa nossa comunidade escolar."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Barra de Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 sr-only">Opções de Filtro</h3>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label htmlFor="search-news-input" className="block text-sm font-medium text-gray-700 mb-1">Pesquisar Notícia</label>
              <SearchBar onSearch={handleSearch} placeholder="Título ou conteúdo..." id="search-news-input" />
            </div>
            <div className="md:w-1/3 lg:w-1/4">
              <label htmlFor="filter-date-input" className="block text-sm font-medium text-gray-700 mb-1">Filtrar a partir de</label>
              <input type="date" id="filter-date-input" value={filterDate} onChange={handleFilterDateChange} className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent text-gray-800" aria-label="Filtrar notícias a partir desta data"/>
            </div>
          </div>
        </div>

        {/* Grid de Notícias */}
        {currentNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            {currentNews.map((item) => (
              <AnimatedCard key={item._id} role="listitem">
                <div onClick={() => navigate("news-detail", item._id)} className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col cursor-pointer group" role="link" tabIndex="0" aria-label={`Ver detalhes da notícia: ${item.title}`} onKeyPress={(e) => { if (e.key === 'Enter') navigate("news-detail", item._id); }}>
                  <img src={`${API_URL}${item.image}`} alt={item.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/CCCCCC/FFFFFF?text=Imagem+indisponível`; }}/>
                  <div className="p-6 flex-grow flex flex-col">
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(item.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex-grow group-hover:text-[#4455a3] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {item.content}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500" role="status" aria-live="polite">Nenhuma notícia encontrada com os critérios de pesquisa/filtro.</p>
        )}
        {/* Paginação */}
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </PageWrapper>
  );
};

export default NewsPage;