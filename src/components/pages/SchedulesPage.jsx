import React, { useState, useEffect } from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import SimpleTable from "../ui/SimpleTable";
import { Search, Download, CalendarDays, Info } from "lucide-react";
import { API_URL } from "../../App";

// Adicionada a importação da biblioteca xlsx para ler arquivos Excel
import * as XLSX from 'xlsx';

// Página de Horários de Aula (Lê Excel e exibe na tela)
const SchedulesPage = ({ schedules }) => {
  const [selectedClass, setSelectedClass] = useState(
    Object.keys(schedules)[0] || ""
  );
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scheduleKeys = Object.keys(schedules).join(",");

  // Garante que sempre haja uma turma selecionada se a lista de horários mudar
  useEffect(() => {
    const availableClasses = Object.keys(schedules);
    if (
      !availableClasses.includes(selectedClass) &&
      availableClasses.length > 0
    ) {
      setSelectedClass(availableClasses[0]);
    }
  }, [scheduleKeys, selectedClass, schedules]); 

  const scheduleUrl = schedules[selectedClass]
    ? `${API_URL}${schedules[selectedClass]}`
    : null;

  // Efeito principal: Baixa o arquivo Excel da turma selecionada, converte para JSON e salva no estado
  useEffect(() => {
    const fetchExcelData = async () => {
      if (!scheduleUrl) return;

      setIsLoading(true);
      try {
        const response = await fetch(scheduleUrl);
        const arrayBuffer = await response.arrayBuffer();
        // Processamento do Excel usando a biblioteca XLSX
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Pega a primeira aba
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setTableData(jsonData);
      } catch (error) {
        console.error("Erro ao carregar ou processar o arquivo Excel:", error);
        setTableData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExcelData();
  }, [scheduleUrl]);

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
              {/* Seleção de turma e botão de download */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
                <div className="relative w-full sm:w-2/3">
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
                {/* Botão para baixar o arquivo original (.xlsx) */}
                {scheduleUrl && (
                  <a
                    href={scheduleUrl}
                    download={`${selectedClass}_horario.xlsx`}
                    className="w-full sm:w-1/3 inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-[#4455a3] shadow-md hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2" size={18} />
                    Baixar Horário
                  </a>
                )}
              </div>

              {/* Tabela de Horários renderizada dinamicamente */}
              {isLoading ? (
                <div className="text-center p-8 text-gray-500">
                  Carregando dados da tabela...
                </div>
              ) : tableData.length > 0 ? (
                <SimpleTable data={tableData} />
              ) : (
                <div className="text-center p-8">
                  <Info className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-4 text-gray-500">
                    Nenhum horário disponível para esta turma.
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