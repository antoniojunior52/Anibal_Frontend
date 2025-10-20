import React from 'react';
import { Trash2 } from 'lucide-react';

const UserListItem = ({ userItem, currentUser, onPermissionChange, onDelete }) => {
  const isCurrentUser = userItem._id === currentUser.id;

  const getRoleLabel = (user) => {
    if (user.isAdmin) return "Administrador";
    if (user.isSecretaria) return "Secretaria";
    return "Utilizador";
  };

  const roleLabel = getRoleLabel(userItem);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 transition-shadow hover:shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Informações do Utilizador */}
        <div>
          <p className="font-bold text-gray-800">
            {userItem.name}
            {isCurrentUser && <span className="text-xs font-normal text-indigo-600 ml-2">(Você)</span>}
          </p>
          <p className="text-sm text-gray-500">{userItem.email}</p>
          <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${userItem.isAdmin ? 'bg-red-100 text-red-700' : userItem.isSecretaria ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
            {roleLabel}
          </span>
        </div>

        {/* Controles de Permissão */}
        <div className="flex items-center space-x-4 self-end sm:self-center">
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 text-sm font-medium text-gray-700">Secretaria</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={userItem.isSecretaria || false} onChange={(e) => onPermissionChange(userItem._id, "isSecretaria", e.target.checked)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${userItem.isSecretaria ? "bg-[#4455a3]" : "bg-gray-200"}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${userItem.isSecretaria ? "translate-x-full" : ""}`}></div>
            </div>
          </label>
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 text-sm font-medium text-gray-700">Admin</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={userItem.isAdmin || false} onChange={(e) => onPermissionChange(userItem._id, "isAdmin", e.target.checked)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${userItem.isAdmin ? "bg-[#4455a3]" : "bg-gray-200"}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${userItem.isAdmin ? "translate-x-full" : ""}`}></div>
            </div>
          </label>
          <button
            onClick={() => onDelete(userItem._id)}
            className="text-gray-500 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isCurrentUser}
            title={isCurrentUser ? "Não pode apagar o seu próprio perfil" : `Apagar utilizador ${userItem.name}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;