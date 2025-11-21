import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { loadSheetJS } from "../../hooks"; // Ensure loadSheetJS is accessible

// Componente para ler e exibir arquivos Excel diretamente no navegador
const ExcelViewer = ({ fileUrl }) => {
  const [data, setData] = useState(null); // Guarda os dados da tabela
  const [loading, setLoading] = useState(true); // Controla o estado de carregamento

  useEffect(() => {
    // Carrega a biblioteca SheetJS dinamicamente antes de tentar usar
    loadSheetJS(() => { 
      // Se não tiver URL ou a biblioteca falhar, para o carregamento
      if (!fileUrl || typeof window.XLSX === "undefined") {
        setLoading(false);
        return;
      }
      setLoading(true);

      // Função assíncrona para baixar e processar o arquivo
      const processFile = async () => {
        try {
          const response = await fetch(fileUrl); // Baixa o arquivo
          const arrayBuffer = await response.arrayBuffer();
          // Lê o arquivo usando a biblioteca XLSX
          const workbook = window.XLSX.read(arrayBuffer, { type: "buffer" });
          const sheetName = workbook.SheetNames[0]; // Pega a primeira aba
          const worksheet = workbook.Sheets[sheetName];
          // Converte a aba em JSON (matriz de dados)
          const jsonData = window.XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
          setData(jsonData);
        } catch (error) {
          setData(null); // Em caso de erro, limpa os dados
        } finally {
          setLoading(false); // Finaliza o carregamento
        }
      };
      processFile();
    });
  }, [fileUrl]); // Recarrega se a URL do arquivo mudar

  // Exibe spinner enquanto carrega
  if (loading)
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4455a3] mx-auto"></div>
        <p className="mt-4 text-gray-500">A carregar o horário...</p>
      </div>
    );
  
  // Exibe erro se não conseguir ler os dados
  if (!data)
    return (
      <div className="text-center p-8">
        <Info className="h-12 w-12 text-red-500 mx-auto" />
        <p className="mt-4 text-red-600 font-semibold">
          Não foi possível carregar o ficheiro do horário.
        </p>
      </div>
    );

  // Renderiza a tabela com os dados do Excel
  return (
    <div className="overflow-x-auto rounded-lg shadow-md border">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Cabeçalho da tabela (primeira linha do Excel) */}
        <thead className="bg-gray-100">
          <tr>
            {data[0]?.map((header, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Corpo da tabela (restante das linhas) */}
        <tbody className="bg-white divide-y divide-gray-200">
          {data.slice(1).map((row, i) => (
            <tr
              key={i}
              className="hover:bg-blue-50 transition-colors duration-200"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelViewer;