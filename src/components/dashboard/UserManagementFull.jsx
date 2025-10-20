import React, { useState, useMemo } from "react";
import FormWrapper from "../ui/FormWrapper";
import { UserCog, PlusCircle, List, Search } from "lucide-react";
import Pagination from "../ui/Pagination";
import LoadingSpinner from "../ui/LoadingSpinner";
import UserListItem from "./UserListItem";
import UserRegistrationForm from "./UserRegistrationForm"; // 1. Importar o formulário de cadastro

const UserManagementFull = ({ users, user, fetchUsers, handleSave, handleDelete, showNotification, handleRegisterByAdmin }) => { // 2. Receber a prop 'handleRegisterByAdmin'
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  const handlePermissionChange = async (userId, field, value) => {
    if (userId === user.id && field === "isAdmin" && !value) {
      showNotification("Não pode remover o seu próprio acesso de Admin.", "error"); return;
    }
    setLoading(true);
    try {
      await handleSave("/api/users", fetchUsers)({ [field]: value }, userId);
      showNotification("Permissões do utilizador atualizadas!", "success");
    } catch (e) {
      showNotification(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Tem a certeza que deseja apagar este utilizador?")) {
      await handleDelete("/api/users", fetchUsers)(userId);
    }
  };

  // 3. Criar uma função para cadastrar e depois mudar de aba
  const handleRegisterAndSwitchTab = async (userData) => {
    // Tenta registrar o utilizador
    await handleRegisterByAdmin(userData);
    // Se o cadastro for bem-sucedido, a lógica no 'handleRegisterByAdmin' (no App.js) já deve atualizar a lista de utilizadores via 'fetchUsers'.
    // Apenas mudamos de aba.
    setActiveTab('list');
  };

  const filteredUsers = useMemo(() => 
    users.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    ), [users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  
  useState(() => { setCurrentPage(1); }, [searchQuery]);

  const tabClasses = (tabName) => `flex items-center justify-center w-full px-4 py-3 font-semibold transition-all duration-300 border-b-2
    ${activeTab === tabName ? "border-yellow-500 text-black" : "border-transparent text-gray-500 hover:text-gray-800"}`;

  return (
    <FormWrapper title="Gerir Utilizadores" icon={<UserCog className="mr-2 text-yellow-500" />}>
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

      {/* 4. Renderizar o formulário de cadastro na aba 'form' */}
      {activeTab === 'form' && (
        <UserRegistrationForm 
          handleRegisterByAdmin={handleRegisterAndSwitchTab} 
        />
      )}

      {activeTab === 'list' && (
        <div className="animate-fade-in">
          {loading && <LoadingSpinner message="A atualizar permissões..." />}
          <div className="relative mb-8">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Search className="h-5 w-5 text-gray-400" /></span>
            <input type="text" placeholder="Buscar por nome ou email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition" />
          </div>
          
          <div className="space-y-4">
            {currentUsers.length > 0 ? (
              currentUsers.map((u) => (
                <UserListItem 
                  key={u._id} userItem={u} currentUser={user}
                  onPermissionChange={handlePermissionChange} onDelete={handleDeleteUser}
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