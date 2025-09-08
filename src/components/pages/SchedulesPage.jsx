// components/pages/SchedulesPage.jsx
import React, { useState, useEffect } from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import ExcelViewer from "../ui/ExcelViewer";
import { Search, Download, CalendarDays, Info } from "lucide-react";
import { API_URL } from "../../App"; // Assuming API_URL is exported from App or moved to a config

const SchedulesPage = ({ schedules }) => {
  const [selectedClass, setSelectedClass] = useState(
    Object.keys(schedules)[0] || ""
  );
  const scheduleKeys = Object.keys(schedules).join(",");

  useEffect(() => {
    const availableClasses = Object.keys(schedules);
    if (
      !availableClasses.includes(selectedClass) &&
      availableClasses.length > 0
    ) {
      setSelectedClass(availableClasses[0]);
    }
  }, [scheduleKeys, selectedClass]);

  const scheduleUrl = schedules[selectedClass]
    ? `${API_URL}${schedules[selectedClass]}`
    : null;
  return (
    <PageWrapper>
      <PageTitle
        title="Horários de Aulas"
        subtitle="Selecione uma turma para visualizar os horários detalhados."
      />
      <div className="container mx-auto max-w-6xl px-4 pb-12">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-t-4 border-[#fcc841]">
          {Object.keys(schedules).length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#4455a3] appearance-none bg-white"
                  >
                    {Object.keys(schedules).map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>
                </div>
                {scheduleUrl && (
                  <a
                    href={scheduleUrl}
                    download={`${selectedClass}_horario.xlsx`}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-[#4455a3] shadow-md hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2" size={18} />
                    Baixar Horário
                  </a>
                )}
              </div>
              {scheduleUrl ? (
                // Adicionado div com overflow-x-auto para responsividade
                <div className="overflow-x-auto">
                  <ExcelViewer fileUrl={scheduleUrl} />
                </div>
              ) : (
                <div className="text-center p-8">
                  <Info className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-4 text-gray-500">
                    Selecione uma turma para ver o horário.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-12">
              <CalendarDays className="h-16 w-16 text-gray-300 mx-auto" />
              <p className="mt-4 text-xl text-gray-500">
                Nenhum horário de turma foi carregado ainda.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default SchedulesPage;