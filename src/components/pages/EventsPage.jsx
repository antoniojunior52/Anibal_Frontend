// components/pages/EventsPage.jsx
import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const EventsPage = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const formattedEvents = events.map(event => ({
    title: event.title,
    date: event.date,
    extendedProps: { description: event.description }
  }));

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      date: clickInfo.event.start,
    });
  };

  const closeModal = () => { setSelectedEvent(null); };

  const renderEventContent = (eventInfo) => (
    // A MUDANÇA ESTÁ AQUI: p-1 -> p-2, text-xs -> text-sm, e removido o 'truncate'
    <div className="bg-pink-500 text-white p-2 rounded-lg text-sm cursor-pointer hover:bg-pink-600 w-full overflow-hidden">
      <i>{eventInfo.event.title}</i>
    </div>
  );

  return (
    <PageWrapper>
      <PageTitle title="Calendário de Eventos" subtitle="Fique por dentro de tudo que acontece na nossa escola." />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <FullCalendar
            plugins={[dayGridPlugin]} initialView="dayGridMonth" locale={ptBrLocale}
            timeZone='UTC'
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek' }}
            events={formattedEvents} eventContent={renderEventContent}
            eventClick={handleEventClick} dayMaxEvents={true}
          />
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative">
              <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" aria-label="Fechar modal"><X size={24} /></button>
              <div className="text-center bg-[#4455a3] text-white py-3 px-4 -m-6 rounded-t-lg mb-6">
                <p className="font-semibold text-lg">{selectedEvent.date.toLocaleDateString("pt-BR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
              </div>
              <h2 
                className="text-2xl font-bold text-gray-800 mb-3"
                style={{
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  wordBreak: 'break-all'
                }}
              >
                {selectedEvent.title}
              </h2>
              <p 
                className="text-gray-600"
                style={{ 
                  whiteSpace: 'normal',
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  wordBreak: 'break-all'
                }}
              >
                {selectedEvent.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};
export default EventsPage;