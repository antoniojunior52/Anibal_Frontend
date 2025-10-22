import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { UtensilsCrossed, PlusCircle, List, FileCheck, Clock, Download, AlertTriangle } from "lucide-react";
import FileUpload from "../ui/FileUpload";
import LoadingSpinner from "../ui/LoadingSpinner";

const MenuFormFull = ({ menu, showNotification, apiService, fetchAllData }) => {
  const [activeTab, setActiveTab] = useState("list");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const resetForm = () => {
    setFile(null);
    setResetKey(prevKey => prevKey + 1);
  };

  const handleAddNew = () => {
    resetForm();
    setActiveTab("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showNotification("Por favor, selecione um arquivo PDF para enviar.", "error");
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      await apiService.postForm("/api/menu", formData);
      showNotification("Cardápio atualizado com sucesso!", "success");
      resetForm();
      await fetchAllData();
      setActiveTab("list"); // Retorna para a aba de visualização
    } catch (e) {
      showNotification(e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const tabClasses = (tabName) => `flex items-center justify-center w-full px-4 py-3 font-semibold transition-all duration-300 border-b-2
    ${activeTab === tabName ? "border-red-500 text-red-500" : "border-transparent text-gray-500 hover:text-gray-800"}`;
    
  const lastUpdated = menu?.updatedAt 
    ? new Date(menu.updatedAt).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
    : 'N/A';
  
  const currentFileName = menu?.fileUrl ? menu.fileUrl.split('/').pop() : 'Nenhum arquivo enviado';

  return (
    <FormWrapper title="Gerir Cardápio" icon={<UtensilsCrossed className="mr-2 text-red-500" />}>
      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab("list")} className={tabClasses("list")}>
          <List size={18} className="mr-2" />
          Cardápio Atual
        </button>
        <button onClick={() => setActiveTab("form")} className={tabClasses("form")}>
          <PlusCircle size={18} className="mr-2" />
          Atualizar Cardápio
        </button>
      </div>

      {/* Aba de Visualização do Cardápio Atual */}
      {activeTab === 'list' && (
        <div className="animate-fade-in">
          {menu?.fileUrl ? (
            <div className="bg-white p-6 rounded-xl shadow-md border space-y-4">
               <h3 className="text-xl font-bold text-gray-800">Status do Cardápio</h3>
               <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FileCheck className="w-5 h-5 mr-3 text-green-600" />
                    <span className="font-medium truncate">{decodeURIComponent(currentFileName)}</span>
                  </div>
                </div>
               <a 
                href={menu.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 text-red-600 font-semibold hover:underline"
              >
              </a>
            </div>
          ) : (
            <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Nenhum cardápio enviado ainda.</p>
                <button 
                  onClick={handleAddNew}
                  className="mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-red-600 transition-all"
                >
                  <PlusCircle size={18} className="inline mr-2" />
                  Enviar primeiro cardápio
                </button>
            </div>
          )}
        </div>
      )}

      {/* Aba de Formulário para Atualizar o Cardápio */}
      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <FileUpload 
            key={resetKey}
            label="Selecione o novo arquivo PDF"
            onChange={setFile}
            allowedTypes={["application/pdf"]}
            fileTypeName="PDF"
          />
          <div className="flex flex-col sm:flex-row gap-4">
             <button type="button" onClick={() => setActiveTab("list")} className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center bg-red-500 text-white p-3 rounded-md shadow-sm hover:bg-red-600 transition-colors disabled:bg-gray-400 font-semibold"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "Enviar Novo Cardápio"}
            </button>
          </div>
        </form>
      )}
    </FormWrapper>
  );
};

export default MenuFormFull;