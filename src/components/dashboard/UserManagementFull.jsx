import React, { useState, useMemo } from "react";
import FormWrapper from "../ui/FormWrapper";
import { UserCog, PlusCircle, List, Search } from "lucide-react";
import Pagination from "../ui/Pagination";
import LoadingSpinner from "../ui/LoadingSpinner";
import UserListItem from "./UserListItem";
import UserRegistrationForm from "./UserRegistrationForm"; 

// Componente principal para Gerenciamento de Usuários (Admin)
// Lista usuários, permite buscar, paginar, alterar permissões e deletar
const UserManagementFull = ({ users, user, fetchUsers, handleSave, handleDelete, showNotification, handleRegisterByAdmin, apiService, navigate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list"); // Alterna entre Lista e Cadastro
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  // Altera permissões (Admin/Secretaria) diretamente na lista
  const handlePermissionChange = async (userId, field, value) => {
    // Impede que o admin remova seu próprio acesso de admin
    if (userId === user.id && field === "isAdmin" && !value) {
      showNotification("Não pode remover o seu próprio acesso de Admin.", "error"); return;
    }
    setLoading(true);
    try {
      // Envia atualização parcial (PATCH logic)
      await handleSave("/api/users", fetchUsers)({ [field]: value }, userId);
      showNotification("Permissões do utilizador atualizadas!", "success");
    } catch (e) {
      showNotification(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Chama a função de deletar (que já possui confirmação)
  const handleDeleteUser = async (userId) => {
    await handleDelete("/api/users", fetchUsers)(userId);
  };

  // Cadastra usuário novo e volta para a aba de lista
  const handleRegisterAndSwitchTab = async (userData) => {
    await handleRegisterByAdmin(userData);
    setActiveTab('list');
  };

  // Filtra usuários por nome ou email
  const filteredUsers = useMemo(() => 
    users.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    ), [users, searchQuery]);

  // Lógica de paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  
  // Volta para a página 1 se a busca mudar
  useState(() => { setCurrentPage(1); }, [searchQuery]);

  const tabClasses = (tabName) => `flex items-center justify-center w-full px-4 py-3 font-semibold transition-all duration-300 border-b-2
    ${activeTab === tabName ? "border-yellow-500 text-black" : "border-transparent text-gray-500 hover:text-gray-800"}`;

  return (
    <FormWrapper title="Gerir Utilizadores" icon={<UserCog className="mr-2 text-yellow-500" />}>
      {/* Abas de Navegação */}
      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab("list")} className={tabClasses("list")}>
          <List size={18} className="mr-2" />
          Lista de Utilizadores ({users.length})
        </button>
        <button onClick={() => setActiveTab("form")} className={tabClasses("form")}>
          <PlusCircle size={18} className="mr-2" />
          Adicionar Novo
        </button>
      </div>

      {/* Formulário de Cadastro */}
      {activeTab === 'form' && (
        <UserRegistrationForm 
          handleRegisterByAdmin={handleRegisterAndSwitchTab} 
          apiService={apiService} 
        />
      )}

      {/* Lista de Usuários */}
      {activeTab === 'list' && (
        <div className="animate-fade-in">
          {loading && <LoadingSpinner message="A atualizar permissões..." />}
          {/* Barra de Busca */}
          <div className="relative mb-8">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Search className="h-5 w-5 text-gray-400" /></span>
            <input type="text" placeholder="Buscar por nome ou email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition" />
          </div>
          
          <div className="space-y-4">
            {currentUsers.length > 0 ? (
              currentUsers.map((u) => (
                <UserListItem 
                  key={u._id} userItem={u} currentUser={user}
                  onPermissionChange={handlePermissionChange} 
                  onDelete={handleDeleteUser} 
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">Nenhum utilizador encontrado.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      )}
    </FormWrapper>
  );
};

export default UserManagementFull;