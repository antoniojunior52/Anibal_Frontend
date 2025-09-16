// components/dashboard/SchedulesFormFull.jsx
import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import FileUpload from "../ui/FileUpload";
import LoadingSpinner from "../ui/LoadingSpinner"; // Importar o LoadingSpinner

const SchedulesFormFull = ({ schedules, showNotification, apiService, fetchAllData }) => {
  const classList = ["6º Ano A", "6º Ano B", "6º Ano C", "7º Ano A", "7º Ano B", "8º Ano A", "8º Ano B", "9º Ano A", "9º Ano B"];
  const [file, setFile] = useState(null);
  const [scheduleClass, setScheduleClass] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleClass || !file) {
      showNotification("Selecione uma turma e o arquivo.", "error");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("className", scheduleClass);
    formData.append("file", file);
    try {
      await apiService.postForm("/api/schedules", formData);
      showNotification("Horário salvo!", "success");
      setScheduleClass("");
      setFile(null);
      setResetKey(prevKey => prevKey + 1);
      fetchAllData();
    } catch (e) {
      showNotification(e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async (className) => {
    const confirmed = window.confirm(`Tem a certeza que quer apagar o horário de ${className}?`);
    if (confirmed) {
      try {
        await apiService.delete(`/api/schedules/${className}`);
        showNotification(`Horário de ${className} removido.`, "success");
        fetchAllData();
      } catch (e) {
        showNotification(e.message, "error");
      }
    }
  };

  return (
    <FormWrapper title="Gerir Horários" icon={<FileSpreadsheet className="mr-2 text-green-500" />}>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="relative">
          <select 
            id="schedule-class" 
            value={scheduleClass} 
            onChange={(e) => setScheduleClass(e.target.value)} 
            // ESTILOS CORRIGIDOS AQUI para padronização
            className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent peer appearance-none" 
            required
          >
            <option value="" disabled></option>
            {classList.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          {/* LABEL CORRIGIDA AQUI para flutuar corretamente */}
          <label 
            htmlFor="schedule-class" 
            className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text ${scheduleClass ? 'top-[-10px] text-xs text-[#4455a3] bg-white px-1' : 'top-2 text-base'} peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#4455a3] peer-focus:bg-white peer-focus:px-1`}
          >
            Turma
          </label>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
           </div>
        </div>
        <FileUpload
          key={resetKey}
          label="Arquivo Excel do Horário"
          onChange={setFile}
          allowedTypes={["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]}
          fileTypeName="Excel"
        />
        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-green-500 text-white p-2 rounded-md shadow-sm hover:bg-green-600 transition-colors disabled:bg-gray-400">
          {isLoading ? <LoadingSpinner size="sm" /> : "Salvar Horário"}
        </button>
      </form>

      <h3 className="text-lg font-semibold border-t pt-4 mt-6">Horários Cadastrados</h3>
      <div className="space-y-3 max-h-40 overflow-y-auto pr-2 mt-4">
        {Object.keys(schedules).length > 0 ? Object.keys(schedules).map((name) => (
          <div key={name} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
            <span className="font-medium text-gray-800">{name}</span>
            <button
              onClick={() => handleDeleteSchedule(name)}
              className="text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors"
              aria-label={`Apagar horário de ${name}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        )) : (
          <p className="text-gray-500 text-center py-4">Nenhum horário cadastrado.</p>
        )}
      </div>
    </FormWrapper>
  );
};
export default SchedulesFormFull;