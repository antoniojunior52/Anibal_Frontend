import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import AnimatedCard from "../ui/AnimatedCard";
import Pagination from "../ui/Pagination";

const EventsPage = ({ events }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <PageWrapper>
      <PageTitle
        title="Calendário de Eventos"
        subtitle="Fique por dentro de tudo que acontece na nossa escola."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            {currentEvents.map((event) => (
              <AnimatedCard key={event._id} role="listitem">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
                  <div className="bg-[#4455a3] text-white p-4 text-center">
                    <p className="text-4xl font-bold">
                      {new Date(event.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        timeZone: "UTC",
                      })}
                    </p>
                    <p className="font-semibold">
                      {new Date(event.date).toLocaleDateString("pt-BR", {
                        month: "long",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </p>
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhum evento encontrado.</p>
        )}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </PageWrapper>
  );
};

export default EventsPage;