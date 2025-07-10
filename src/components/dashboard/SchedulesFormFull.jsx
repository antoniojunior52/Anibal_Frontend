// components/dashboard/SchedulesFormFull.jsx
import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { FileSpreadsheet, Trash2 } from "lucide-react";

const SchedulesFormFull = ({ schedules, showNotification, apiService, fetchAllData, CustomFileInput }) => {
  const classList = [
    "6º Ano A",
    "6º Ano B",
    "6º Ano C",
    "7º Ano A",
    "7º Ano B",
    "8º Ano A",
    "8º Ano B",
    "9º Ano A",
    "9º Ano B",
  ];
  const [file, setFile] = useState(null);
  const [scheduleClass, setScheduleClass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleClass || !file) {
      showNotification("Selecione uma turma e o arquivo.", "error");
      return;
    }
    const formData = new FormData();
    formData.append("className", scheduleClass); // Send class name
    formData.append("file", file); // 'file' matches the Multer field name
    try {
      // Alterado para usar apiService.postForm para enviar FormData corretamente
      await apiService.postForm("/api/schedules", formData); // Post directly to /api/schedules
      showNotification("Horário salvo!", "success");
      setScheduleClass("");
      setFile(null);
      fetchAllData(); // Re-fetch all data to ensure consistency
    } catch (e) {
      showNotification(e.message, "error");
    }
  };

  const handleDeleteSchedule = async (className) => {
    const confirmed = window.confirm(
      `Tem a certeza que quer apagar o horário de ${className}?`
    );
    if (confirmed) {
      try {
        await apiService.delete(`/api/schedules/${className}`); // Delete by class name
        showNotification(`Horário de ${className} removido.`, "success");
        fetchAllData(); // Re-fetch all data to update the list
      } catch (e) {
        showNotification(e.message, "error");
      }
    }
  };

  return (
    <FormWrapper
      title="Gerir Horários"
      icon={<FileSpreadsheet className="mr-2 text-green-500" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="relative">
          <select
            id="schedule-class"
            value={scheduleClass}
            onChange={(e) => setScheduleClass(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent
                       peer transition-all duration-200 ease-in-out appearance-none pr-8"
            required
          >
            <option value="" disabled>
              
            </option>
            {classList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label
            htmlFor="schedule-class"
            className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text
                       ${scheduleClass ? 'top-[-10px] text-xs text-[#4455a3] bg-white px-1' : 'top-2 text-base'}
                       peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#4455a3] peer-focus:bg-white peer-focus:px-1`}
          >
            Turma
          </label>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        <CustomFileInput // Using CustomFileInput
          label="Arquivo Excel"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".xlsx, .xls"
          fileName={file?.name}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded-md shadow-sm hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1"
        >
          Salvar Horário
        </button>
      </form>
      <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
        {Object.keys(schedules).map((name) => (
          <div
            key={name}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm"
          >
            <span>{name}</span>
            <button
              onClick={() => handleDeleteSchedule(name)}
              className="text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </FormWrapper>
  );
};

export default SchedulesFormFull;
