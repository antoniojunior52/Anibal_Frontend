// components/dashboard/HistoryFormFull.jsx
import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { Milestone, Pencil, Trash2 } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput"; // Import FloatingLabelInput

const HistoryFormFull = ({ history, fetchAllData, handleSave, handleDelete, showNotification }) => {
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);

  const resetForm = () => {
    setYear("");
    setTitle("");
    setDescription("");
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSave("/api/history", fetchAllData)(
        { year, title, description },
        editing?._id
      );
      resetForm();
      showNotification("Marco histórico salvo!", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setYear(item.year);
    setTitle(item.title);
    setDescription(item.description);
    window.scrollTo(0, 0);
  };

  return (
    <FormWrapper
      title="Gerir História"
      icon={<Milestone className="mr-2 text-yellow-500" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <FloatingLabelInput
          id="history-year"
          label="Ano (ex: 2024)"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <FloatingLabelInput
          id="history-title"
          label="Título do Marco"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="relative">
          <textarea
            id="history-description"
            placeholder=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent
                       peer transition-all duration-200 ease-in-out"
            rows="3"
            required
          ></textarea>
          <label
            htmlFor="history-description"
            className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text
                       ${description ? 'top-[-10px] text-xs text-[#4455a3] bg-white px-1' : 'top-2 text-base'}
                       peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#4455a3] peer-focus:bg-white peer-focus:px-1
                       peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500`}
          >
            Descrição
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white p-2 rounded-md shadow-sm hover:bg-yellow-600 transition-all duration-300 transform hover:-translate-y-1"
        >
          {editing ? "Atualizar Marco" : "Adicionar Marco"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full bg-gray-500 text-white p-2 rounded-md shadow-sm hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-1 mt-2"
          >
            Cancelar Edição
          </button>
        )}
      </form>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {history.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm"
          >
            <div>
              <span className="font-semibold">
                {item.year}: {item.title}
              </span>
            </div>
            <div className="space-x-2 flex items-center">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-500 p-2 rounded-full hover:bg-blue-100 transition-colors"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() =>
                  handleDelete("/api/history", fetchAllData)(item._id)
                }
                className="text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </FormWrapper>
  );
};

export default HistoryFormFull;
