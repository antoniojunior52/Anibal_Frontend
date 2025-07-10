// components/dashboard/MenuFormFull.jsx
import { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { UtensilsCrossed } from "lucide-react";

const MenuFormFull = ({ setMenuUrl, showNotification, apiService, fetchAllData, CustomFileInput }) => {
  const [file, setFile] = useState(null);
  const [resetKey, setResetKey] = useState(0); // Novo estado para forçar o reset do CustomFileInput

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // 'file' matches the Multer field name
      try {
        const response = await apiService.post("/api/menu", formData); // Post directly to /api/menu
        setMenuUrl(response.fileUrl); // Update state with the new URL from backend
        showNotification("Cardápio atualizado!", "success");
        setFile(null);
        setResetKey(prevKey => prevKey + 1); // Incrementa a chave para forçar a remontagem do CustomFileInput
        fetchAllData(); // Re-fetch all data to ensure consistency
      } catch (e) {
        showNotification(e.message, "error");
      }
    } else {
      showNotification("Selecione um arquivo PDF.", "error");
    }
  };

  return (
    <FormWrapper
      title="Gerir Cardápio"
      icon={<UtensilsCrossed className="mr-2 text-red-500" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomFileInput // Using CustomFileInput
          key={resetKey} // Adicionado a prop key aqui
          label="Arquivo PDF do Cardápio"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".pdf"
          fileName={file?.name}
        />
        <button
          type="submit"
          className="w-full bg-red-500 text-white p-2 rounded-md shadow-sm hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1"
        >
          Atualizar Cardápio
        </button>
      </form>
    </FormWrapper>
  );
};

export default MenuFormFull;
