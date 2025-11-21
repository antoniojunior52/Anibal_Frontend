import React from 'react';

// Componente de Tabela Simples e Dinâmica
// Recebe um array de objetos (data) e cria a tabela automaticamente baseada nas chaves desses objetos
const SimpleTable = ({ data }) => {
  // Se não houver dados, exibe mensagem amigável
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">Nenhum dado para exibir.</p>;
  }

  // Pega as chaves do primeiro objeto para criar o cabeçalho (ex: nome, email, data)
  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse table-fixed text-center">
        {/* Cabeçalho da Tabela */}
        <thead>
          <tr className="bg-gray-100 text-sm font-semibold">
            {headers.map((header) => (
              <th key={header} className="p-2 border border-gray-200 overflow-wrap break-word">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Corpo da Tabela */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-sm">
              {/* Para cada linha, varre as colunas (headers) para garantir a ordem correta */}
              {headers.map((header) => (
                <td key={header} className="p-2 border border-gray-200 overflow-wrap break-word">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;