// components/dashboard/UserManagementFull.jsx
import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { UserCog, Trash2 } from "lucide-react";
import Pagination from "../ui/Pagination"; // Importar o componente de Paginação
import LoadingSpinner from "../ui/LoadingSpinner"; // Importar o LoadingSpinner

const UserManagementFull = ({ users, user, fetchUsers, handleSave, handleDelete, showNotification }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Definir quantos utilizadores por página
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // Calcular utilizadores para a página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePermissionChange = async (userId, field, value) => {
    setLoading(true); // Iniciar carregamento
    try {
      if (userId === user.id && field === "isAdmin" && !value) {
        showNotification(
          "Não pode remover o seu próprio acesso de Admin.",
          "error"
        );
        setLoading(false); // Parar carregamento
        return;
      }
      await handleSave("/api/users", fetchUsers)({ [field]: value }, userId);
      showNotification("Permissões do utilizador atualizadas!.", "success"); // Mensagem de sucesso mais clara
    } catch (e) {
      showNotification(e.message, "error");
    } finally {
      setLoading(false); // Parar carregamento
    }
  };

  return (
    <FormWrapper
      title="Gerir Utilizadores"
      icon={<UserCog className="mr-2 text-yellow-500" />}
    >
      {loading && <LoadingSpinner message="A atualizar permissões..." />} {/* Exibir spinner */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2" role="region" aria-label="Lista de Utilizadores"> {/* Adicionado role e aria-label */}
        {currentUsers.length > 0 ? (
          currentUsers.map((u) => (
            <div
              key={u._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-3 rounded-md shadow-sm space-y-3 md:space-y-0"
              aria-label={`Utilizador: ${u.name} - ${u.email}`} // Rótulo para cada item
            >
              <div>
                <p className="font-semibold">
                  {u.name}{" "}
                  {u._id === user.id && (
                    <span className="text-xs text-[#4455a3]">(Você)</span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {u.email} - <span className="italic">{u.role}</span>
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <span className="mr-2 text-sm">Secretaria</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={u.isSecretaria || false}
                      onChange={(e) =>
                        handlePermissionChange(
                          u._id,
                          "isSecretaria",
                          e.target.checked
                        )
                      }
                      aria-label={`Alterar permissão de secretaria para ${u.name}`} // Rótulo para acessibilidade
                    />
                    <div
                      className={`block w-10 h-6 rounded-full transition-colors ${
                        u.isSecretaria ? "bg-[#4455a3]" : "bg-gray-200"
                      }`}
                      aria-hidden="true" // Esconder o visual do toggle do leitor de tela
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        u.isSecretaria ? "translate-x-full" : ""
                      }`}
                      aria-hidden="true" // Esconder o visual do toggle do leitor de tela
                    ></div>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <span className="mr-2 text-sm">Admin</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={u.isAdmin || false}
                      onChange={(e) =>
                        handlePermissionChange(
                          u._id,
                          "isAdmin",
                          e.target.checked
                        )
                      }
                      aria-label={`Alterar permissão de administrador para ${u.name}`} // Rótulo para acessibilidade
                    />
                    <div
                      className={`block w-10 h-6 rounded-full transition-colors ${
                        u.isAdmin ? "bg-[#4455a3]" : "bg-gray-200"
                      }`}
                      aria-hidden="true" // Esconder o visual do toggle do leitor de tela
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        u.isAdmin ? "translate-x-full" : ""
                      }`}
                      aria-hidden="true" // Esconder o visual do toggle do leitor de tela
                    ></div>
                  </div>
                </label>
                <button
                  onClick={() => handleDelete("/api/users", fetchUsers)(u._id)}
                  className="text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50"
                  disabled={u._id === user.id}
                  aria-label={`Apagar utilizador ${u.name}`} // Rótulo para acessibilidade
                >
                  <Trash2 size={18} aria-hidden="true" /> {/* Ícone decorativo */}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhum utilizador encontrado.</p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </FormWrapper>
  );
};

export default UserManagementFull;
