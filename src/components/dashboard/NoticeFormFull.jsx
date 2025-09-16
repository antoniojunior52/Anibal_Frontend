// components/dashboard/NoticeFormFull.jsx
import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { Megaphone, Trash2 } from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";

const NoticeFormFull = ({ notices, fetchAllData, handleSave, handleDelete, showNotification, user }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleSave("/api/notices", fetchAllData)({ content });
      setContent("");
      showNotification("Recado publicado com sucesso!", "success");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper title="Gerir Recados do Dia" icon={<Megaphone className="mr-2 text-[#ec9c30]" />}>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="relative">
          <textarea
            id="notice-content"
            placeholder=" "
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent peer"
            rows="4"
            required
            maxLength="500"
          ></textarea>
          <label htmlFor="notice-content" className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text ${content ? 'top-[-10px] text-xs text-[#4455a3] bg-white px-1' : 'top-2 text-base'} peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#4455a3] peer-focus:bg-white peer-focus:px-1`}>
            Escreva o seu recado aqui...
          </label>
        </div>
        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-[#ec9c30] text-white p-2 rounded-md shadow-sm hover:bg-[#d68a2a] transition-colors disabled:bg-gray-400">
          {isLoading ? <LoadingSpinner size="sm" /> : 'Publicar Recado'}
        </button>
      </form>
      <h3 className="text-lg font-semibold border-t pt-4 mt-6">Recados Atuais</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 mt-4">
        {notices.length > 0 ? notices.map((notice) => (
          <div key={notice._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
            <p className="text-sm text-gray-700 flex-1 mr-4">{notice.content}</p>
            {user?.isAdmin && (
              <button onClick={() => handleDelete("/api/notices", fetchAllData)(notice._id)} className="text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )) : (
          <p className="text-gray-500 text-center py-4">Nenhum recado publicado.</p>
        )}
      </div>
    </FormWrapper>
  );
};

export default NoticeFormFull;