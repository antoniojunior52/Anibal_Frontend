import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { loadSheetJS } from "../../hooks"; // Ensure loadSheetJS is accessible

const ExcelViewer = ({ fileUrl }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSheetJS(() => { // Ensure SheetJS is loaded before trying to use it
      if (!fileUrl || typeof window.XLSX === "undefined") {
        setLoading(false);
        return;
      }
      setLoading(true);
      const processFile = async () => {
        try {
          const response = await fetch(fileUrl);
          const arrayBuffer = await response.arrayBuffer();
          const workbook = window.XLSX.read(arrayBuffer, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = window.XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
          setData(jsonData);
        } catch (error) {
          setData(null);
        } finally {
          setLoading(false);
        }
      };
      processFile();
    });
  }, [fileUrl]);

  if (loading)
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4455a3] mx-auto"></div>
        <p className="mt-4 text-gray-500">A carregar o horário...</p>
      </div>
    );
  if (!data)
    return (
      <div className="text-center p-8">
        <Info className="h-12 w-12 text-red-500 mx-auto" />
        <p className="mt-4 text-red-600 font-semibold">
          Não foi possível carregar o ficheiro do horário.
        </p>
      </div>
    );
  return (
    <div className="overflow-x-auto rounded-lg shadow-md border">
      <table className="min-w-full divide-y divide-gray-200">
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