import React, { useState, useEffect, useRef } from "react";
import { CalendarDays, Newspaper, Megaphone } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// apiService.js (Assumindo que este arquivo não mudou)
const API_URL = "http://localhost:5000";

const apiService = {
  get: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error(`Erro HTTP! Status: ${res.status}`);
    return res.json();
  },
  requestWithBody: async (endpoint, method, data, isFormData = false) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const headers = {};
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    const responseData = await res.json();
    if (!res.ok) {
      throw new Error(responseData.msg || `Erro HTTP! Status: ${res.status}`);
    }
    return responseData;
  },
  post: (endpoint, data) => apiService.requestWithBody(endpoint, "POST", data),
  put: (endpoint, data) => apiService.requestWithBody(endpoint, "PUT", data),
  delete: (endpoint) => apiService.requestWithBody(endpoint, "DELETE", {}),
  postForm: (endpoint, formData) =>
    apiService.requestWithBody(endpoint, "POST", formData, true),
  putForm: (endpoint, formData) =>
    apiService.requestWithBody(endpoint, "PUT", formData, true),
};

// hooks.js (Assumindo que este arquivo não mudou)
export const useScrollAnimation = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return [ref, isVisible];
};

const useAPI = () => {
  const [data, setData] = useState({ news: [], notices: [], events: [] });
  const [loading, setLoading] = useState({ news: true, notices: true, events: true });
  const [error, setError] = useState({ news: false, notices: false, events: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, noticesData, eventsData] = await Promise.all([
          apiService.get('/api/news'),
          apiService.get('/api/notices'),
          apiService.get('/api/events'),
        ]);

        setData({
          news: newsData,
          notices: noticesData,
          events: eventsData,
        });
      } catch (e) {
        setError({ news: true, notices: true, events: true });
      } finally {
        setLoading({ news: false, notices: false, events: false });
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

// Componente simulado para envolver a página
const PageWrapper = ({ children }) => (
  <div className="bg-gray-50 font-sans text-gray-800 antialiased min-h-screen">
    {children}
  </div>
);

// Componente de link simulado
const SectionLink = ({ to, children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    console.log(`Navegando para: ${to}`);
    alert(`Navegando para ${to}`);
  };

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a onClick={handleClick} href="#" className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors">
      {children}
    </a>
  );
};

// Componente principal da página
const HomePage = () => {
  const { data, loading, error } = useAPI();

  const getRecentItems = (items) => {
    return items ? items.slice(0, 4) : [];
  };

  const recentNews = getRecentItems(data.news);
  const recentNotices = getRecentItems(data.notices);
  const recentEvents = getRecentItems(data.events);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-96 lg:h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src="./fotoEscola.jpg"
          alt="Foto da escola"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent flex items-center justify-center p-4">
          <div className="text-center text-white max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 animate-fade-in-down drop-shadow-lg">
              Bem-vindo ao Portal da Escola
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl font-light mb-6 animate-fade-in-up drop-shadow-md">
              Seu acesso rápido a todas as informações importantes.
            </p>
          </div>
        </div>
      </div>

      <PageWrapper>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-12 relative z-10">
          {/* Seção de Notícias */}
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 animate-slide-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Últimas Notícias</h2>
              <SectionLink to="/news">
                Ver todas &rarr;
              </SectionLink>
            </div>
            {loading.news ? (
              <p className="text-center text-gray-500">Carregando notícias...</p>
            ) : error.news ? (
              <p className="text-center text-red-500">Erro ao carregar notícias.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentNews.length > 0 ? (
                  recentNews.map((item) => (
                    <div key={item._id} className="p-6 rounded-xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                      {item.imageUrl && (
                        <img
                          src={`${API_URL}${item.imageUrl}`}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded-md mb-4"
                        />
                      )}
                      <div className="flex items-start mb-4">
                        <Newspaper className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-500">
                            Publicado em {format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{item.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">Nenhuma notícia encontrada.</p>
                )}
              </div>
            )}
          </section>

          {/* Seção de Recados */}
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-orange-500 animate-slide-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recados Mais Recentes</h2>
            </div>
            {loading.notices ? (
              <p className="text-center text-gray-500">Carregando recados...</p>
            ) : error.notices ? (
              <p className="text-center text-red-500">Erro ao carregar recados.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentNotices.length > 0 ? (
                  recentNotices.map((item) => (
                    <div key={item._id} className="p-6 rounded-xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start mb-4">
                        <Megaphone className="w-8 h-8 text-orange-600 mr-4 flex-shrink-0" />
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-500">
                            Autor: {item.author}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{item.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">Nenhum recado encontrado.</p>
                )}
              </div>
            )}
          </section>

          {/* Seção de Eventos */}
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-red-500 animate-slide-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Próximos Eventos</h2>
              <SectionLink to="/events">
                Ver todos &rarr;
              </SectionLink>
            </div>
            {loading.events ? (
              <p className="text-center text-gray-500">Carregando eventos...</p>
            ) : error.events ? (
              <p className="text-center text-red-500">Erro ao carregar eventos.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentEvents.length > 0 ? (
                  recentEvents.map((item) => (
                    <div key={item._id} className="p-6 rounded-xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start mb-4">
                        <CalendarDays className="w-8 h-8 text-red-600 mr-4 flex-shrink-0" />
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-500">
                             {format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">Nenhum evento encontrado.</p>
                )}
              </div>
            )}
          </section>
        </div>
      </PageWrapper>
    </div>
  );
};

export default HomePage;