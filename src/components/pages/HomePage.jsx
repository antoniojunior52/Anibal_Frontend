import React from "react";
import { CalendarDays, Newspaper, Megaphone, RefreshCw } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDataFetching } from "../../hooks/customHooks";
import NewsCardSkeleton from "../ui/NewsCardSkeleton";
import NoticeCardSkeleton from "../ui/NoticeCardSkeleton";
import EventCardSkeleton from "../ui/EventCardSkeleton";
import PageWrapper from "../ui/PageWrapper";
import { API_URL } from "../../config";

const HomePage = ({ navigate }) => {
  const {
    data: news,
    loading: newsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useDataFetching("/api/news");
  const {
    data: notices,
    loading: noticesLoading,
    error: noticesError,
    refetch: refetchNotices,
  } = useDataFetching("/api/notices");
  const {
    data: events,
    loading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useDataFetching("/api/events");

  const getRecentItems = (items) => items?.slice(0, 4) || [];
  const recentNews = getRecentItems(news);
  const recentNotices = getRecentItems(notices);
  const recentEvents = getRecentItems(events);

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
          {/* Só renderiza a seção se tiver notícias, estiver carregando ou der erro */}
          {(recentNews.length > 0 || newsLoading || newsError) && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 animate-slide-in-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Últimas Notícias
                </h2>
                <button
                  onClick={() => navigate("news")}
                  className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Ver todas &rarr;
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {newsLoading ? (
                  [...Array(4)].map((_, i) => <NewsCardSkeleton key={i} />)
                ) : newsError ? (
                  <div className="col-span-full flex flex-col items-center justify-center text-center py-8">
                    <p className="text-red-500 mb-4">
                      Ocorreu um erro ao carregar as notícias.
                    </p>
                    <button
                      onClick={refetchNews}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                    >
                      <RefreshCw size={16} className="mr-2" /> Tentar Novamente
                    </button>
                  </div>
                ) : (
                  recentNews.map((item) => (
                    <div
                      key={item._id}
                      className="p-6 rounded-xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                      onClick={() => navigate("news-detail", item._id)}
                      role="link"
                      tabIndex="0"
                    >
                      {item.image && (
                        <img
                          src={`${API_URL}${item.image}`}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded-md mb-4"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/600x400/CCCCCC/FFFFFF?text=Imagem+indisponível`;
                          }}
                        />
                      )}
                      <div className="flex items-start mb-4">
                        <Newspaper className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Publicado em{" "}
                            {format(parseISO(item.date), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {item.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
          
          {/* Seção de Recados */}
          {/* Só renderiza a seção se tiver recados, estiver carregando ou der erro */}
          {(recentNotices.length > 0 || noticesLoading || noticesError) && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-orange-500 animate-slide-in-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recados Mais Recentes
                </h2>
                <button
                  onClick={() => navigate("notices")}
                  className="text-sm font-semibold text-orange-500 hover:text-orange-700 transition-colors"
                >
                  Ver todos &rarr;
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {noticesLoading ? (
                  [...Array(4)].map((_, i) => <NoticeCardSkeleton key={i} />)
                ) : noticesError ? (
                  <div className="col-span-full flex flex-col items-center justify-center text-center py-8">
                    <p className="text-red-500 mb-4">
                      Ocorreu um erro ao carregar os recados.
                    </p>
                    <button
                      onClick={refetchNotices}
                      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors"
                    >
                      <RefreshCw size={16} className="mr-2" /> Tentar Novamente
                    </button>
                  </div>
                ) : (
                  recentNotices.map((item) => (
                    // CARD MODIFICADO: Removido onClick, cursor-pointer, role, tabIndex e group
                    <div
                      key={item._id}
                      className="p-6 rounded-xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start mb-4">
                        <Megaphone className="w-8 h-8 text-orange-600 mr-4 flex-shrink-0" />
                        <div className="flex-grow">
                          {/* TÍTULO MODIFICADO: Removido group-hover */}
                          <h3 className="text-lg font-bold text-gray-800 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Autor: {item.author}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {item.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Seção de Eventos */}
          {/* Só renderiza a seção se tiver eventos, estiver carregando ou der erro */}
          {(recentEvents.length > 0 || eventsLoading || eventsError) && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-red-500 animate-slide-in-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Próximos Eventos
                </h2>
                <button
                  onClick={() => navigate("events")}
                  className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
                >
                  Ver todos &rarr;
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {eventsLoading ? (
                  [...Array(4)].map((_, i) => <EventCardSkeleton key={i} />)
                ) : eventsError ? (
                  <div className="col-span-full flex flex-col items-center justify-center text-center py-8">
                    <p className="text-red-500 mb-4">
                      Ocorreu um erro ao carregar os eventos.
                    </p>
                    <button
                      onClick={refetchEvents}
                      className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors"
                    >
                      <RefreshCw size={16} className="mr-2" /> Tentar Novamente
                    </button>
                  </div>
                ) : (
                  recentEvents.map((item) => (
                    // CARD MODIFICADO: Removido onClick, cursor-pointer, role, tabIndex e group
                    <div
                      key={item._id}
                      className="p-6 rounded-xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start mb-4">
                        <CalendarDays className="w-8 h-8 text-red-600 mr-4 flex-shrink-0" />
                        <div className="flex-grow">
                          {/* TÍTULO MODIFICADO: Removido group-hover */}
                          <h3 className="text-lg font-bold text-gray-800 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-lg font-bold text-red-600">
                            {format(parseISO(item.date), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>
      </PageWrapper>
    </div>
  );
};

export default HomePage;