import React from 'react';
import { Trash2, Sheet, Download } from 'lucide-react';

const ScheduleItem = ({ className, scheduleData, onDelete }) => {
  // A prop 'scheduleData' deve conter a URL do arquivo, ex: { fileUrl: '...' }
  const fileUrl = scheduleData?.fileUrl;

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-shadow hover:shadow-lg">
      <div className="flex items-center">
        <Sheet className="w-6 h-6 mr-3 text-green-600 flex-shrink-0" />
        <span className="font-bold text-gray-800">{className}</span>
      </div>

      <div className="flex items-center space-x-2 self-end sm:self-center">
        {fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors"
            aria-label={`Ver horário de ${className}`}
          >
            <Download size={16} className="mr-2" />
            Ver / Baixar
          </a>
        )}
        <button
          onClick={() => onDelete(className)}
          className="text-gray-500 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
          aria-label={`Apagar horário de ${className}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ScheduleItem;