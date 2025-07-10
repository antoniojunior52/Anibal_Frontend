// components/dashboard/EventsFormFull.jsx
import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { PartyPopper, Pencil, Trash2 } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput"; // Import FloatingLabelInput

const EventsFormFull = ({ events, fetchAllData, handleSave, handleDelete, showNotification }) => {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);

  const resetForm = () => {
    setDate("");
    setTitle("");
    setDescription("");
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSave("/api/events", fetchAllData)(
        { date, title, description },
        editing?._id
      );
      resetForm();
      showNotification("Evento salvo!", "success");
    } catch (e) {
      showNotification(e.message, "error");
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setDate(item.date.split("T")[0]);
    setTitle(item.title);
    setDescription(item.description);
    window.scrollTo(0, 0);
  };

  return (
    <FormWrapper
      title="Gerir Eventos"
      icon={<PartyPopper className="mr-2 text-pink-500" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <FloatingLabelInput
          id="event-date"
          label="Data do Evento"
          type="date" // Ensure type is date
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <FloatingLabelInput
          id="event-title"
          label="Título do Evento"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="relative">
          <textarea
            id="event-description"
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
            htmlFor="event-description"
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
          className="w-full bg-pink-500 text-white p-2 rounded-md shadow-sm hover:bg-pink-600 transition-all duration-300 transform hover:-translate-y-1"
        >
          {editing ? "Atualizar Evento" : "Adicionar Evento"}
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
        {events.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm"
          >
            <div>
              <span className="font-semibold">{item.title}</span>
              <p className="text-sm text-gray-500">
                {new Date(item.date).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })}
              </p>
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
                  handleDelete("/api/events", fetchAllData)(item._id)
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

export default EventsFormFull;
