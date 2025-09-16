// components/dashboard/MenuFormFull.jsx
import { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { UtensilsCrossed } from "lucide-react";
import FileUpload from "../ui/FileUpload"; // USAR O NOVO COMPONENTE

const MenuFormFull = ({ setMenuUrl, showNotification, apiService, fetchAllData }) => {
  const [file, setFile] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await apiService.postForm("/api/menu", formData);
        setMenuUrl(response.fileUrl);
        showNotification("Cardápio atualizado!", "success");
        setFile(null);
        setResetKey(prevKey => prevKey + 1);
        fetchAllData();
      } catch (e) {
        showNotification(e.message, "error");
      }
    } else {
      showNotification("Selecione um arquivo PDF.", "error");
    }
  };

  return (
    <FormWrapper title="Gerir Cardápio" icon={<UtensilsCrossed className="mr-2 text-red-500" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FileUpload 
          key={resetKey}
          label="Arquivo PDF do Cardápio"
          onChange={setFile}
          allowedTypes={["application/pdf"]}
          fileTypeName="PDF"
        />
        <button type="submit" className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600">Atualizar Cardápio</button>
      </form>
    </FormWrapper>
  );
};
export default MenuFormFull;