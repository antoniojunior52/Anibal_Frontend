import React from 'react';

const SimpleTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">Nenhum dado para exibir.</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse table-fixed text-center">
        <thead>
          <tr className="bg-gray-100 text-sm font-semibold">
            {headers.map((header) => (
              <th key={header} className="p-2 border border-gray-200 overflow-wrap break-word">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-sm">
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