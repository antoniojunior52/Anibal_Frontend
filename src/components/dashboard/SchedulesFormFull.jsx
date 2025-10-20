import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { FileSpreadsheet, PlusCircle, List, Search } from "lucide-react";
import FileUpload from "../ui/FileUpload";
import LoadingSpinner from "../ui/LoadingSpinner";
import ScheduleItem from "./ScheduleItem";

const SchedulesFormFull = ({ schedules, showNotification, apiService, fetchAllData }) => {
  const classList = ["6º Ano A", "6º Ano B", "6º Ano C", "7º Ano A", "7º Ano B", "8º Ano A", "8º Ano B", "9º Ano A", "9º Ano B"];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [file, setFile] = useState(null);
  const [scheduleClass, setScheduleClass] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setScheduleClass("");
    setFile(null);
    setResetKey(prevKey => prevKey + 1);
  };
  
  const handleAddNew = () => {
    resetForm();
    setActiveTab("form");
  };

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
      showNotification(`Horário para ${scheduleClass} salvo com sucesso!`, "success");
      resetForm();
      await fetchAllData();
      setActiveTab("list");
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
        await apiService.delete(`/api/schedules/${encodeURIComponent(className)}`);
        showNotification(`Horário de ${className} removido.`, "success");
        fetchAllData();
      } catch (e) {
        showNotification(e.message, "error");
      }
    }
  };
  
  const tabClasses = (tabName) => `flex items-center justify-center w-full px-4 py-3 font-semibold transition-all duration-300 border-b-2
    ${activeTab === tabName ? "border-green-500 text-black" : "border-transparent text-gray-500 hover:text-gray-800"}`;

  return (
    <FormWrapper title="Gerir Horários" icon={<FileSpreadsheet className="mr-2 text-green-500" />}>
      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab("list")} className={tabClasses("list")}>
          <List size={18} className="mr-2" />
          Horários Cadastrados ({Object.keys(schedules).length})
        </button>
        <button onClick={() => setActiveTab("form")} className={tabClasses("form")}>
          <PlusCircle size={18} className="mr-2" />
          Adicionar / Atualizar
        </button>
      </div>

      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div>
            <label htmlFor="schedule-class" className="block text-sm font-medium text-gray-700 mb-1">
              Turma
            </label>
            <div className="relative">
              <select 
                id="schedule-class" 
                value={scheduleClass} 
                onChange={(e) => setScheduleClass(e.target.value)} 
                className="block w-full px-3 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none" 
                required
              >
                <option value="">Selecione uma turma...</option>
                {classList.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {schedules[scheduleClass] && (
            <p className="text-sm text-center text-amber-700 bg-amber-100 p-2 rounded-md">Atenção: A turma selecionada já possui um horário. O envio de um novo arquivo irá substituí-lo.</p>
          )}
          <FileUpload key={resetKey} label="Arquivo Excel do Horário" onChange={setFile} allowedTypes={["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]} fileTypeName="Excel" />
          <div className="flex flex-col sm:flex-row gap-4">
            {/* CORREÇÃO AQUI: 'text-white' alterado para 'text-black' */}
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-green-500 text-black p-3 rounded-md shadow-sm hover:bg-green-600 transition-colors disabled:bg-gray-400 font-semibold">
              {isLoading ? <LoadingSpinner size="sm" /> : "Salvar Horário"}
            </button>
            <button type="button" onClick={() => setActiveTab("list")} className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {activeTab === 'list' && (
        <div className="animate-fade-in">
          <div className="relative mb-8">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Buscar por turma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>
          {(() => {
            const sortedClassNames = Object.keys(schedules).sort();
            const filteredClassNames = sortedClassNames.filter(name =>
              name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (filteredClassNames.length > 0) {
              return (
                <div className="space-y-4">
                  {filteredClassNames.map(name => (
                    <ScheduleItem 
                      key={name}
                      className={name}
                      scheduleData={schedules[name]}
                      onDelete={handleDeleteSchedule}
                    />
                  ))}
                </div>
              );
            }
            if (Object.keys(schedules).length > 0 && filteredClassNames.length === 0) {
              return (<div className="text-center py-10 px-4 border-2 border-dashed rounded-lg"><p className="text-gray-600 font-semibold">Nenhuma turma encontrada</p></div>);
            }
            return (
              <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Nenhum horário cadastrado.</p>
                {/* CORREÇÃO AQUI: 'text-white' alterado para 'text-black' */}
                <button onClick={handleAddNew} className="mt-4 bg-green-500 text-black font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-green-600 transition-all">
                  <PlusCircle size={18} className="inline mr-2" />
                  Cadastrar primeiro horário
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </FormWrapper>
  );
};

export default SchedulesFormFull;