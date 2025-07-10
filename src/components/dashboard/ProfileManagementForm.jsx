// components/dashboard/ProfileManagementForm.jsx
import React, { useState } from "react";
import FormWrapper from "../ui/FormWrapper";
import { UserCircle, Lock } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput"; // Import FloatingLabelInput

const ProfileManagementForm = ({ user, handleProfileUpdate, handleChangePassword, showNotification }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleProfileUpdate({ name, email });
    } catch (error) {
      /* already handled */
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showNotification("As novas senhas não coincidem.", "error");
      return;
    }
    if (!currentPassword || !newPassword) {
      showNotification("Todos os campos de senha são obrigatórios.", "error");
      return;
    }
    try {
      await handleChangePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      /* error is already shown by handleChangePassword */
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <FormWrapper
        title="Informações do Perfil"
        icon={<UserCircle className="mr-2 text-[#4455a3]" />}
      >
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <FloatingLabelInput
            id="profile-name"
            label="Nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FloatingLabelInput
            id="profile-email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#4455a3] text-white p-2 rounded-md shadow-sm hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1"
          >
            Salvar Informações
          </button>
        </form>
      </FormWrapper>
      <FormWrapper
        title="Alterar Senha"
        icon={<Lock className="mr-2 text-[#4455a3]" />}
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <FloatingLabelInput
            id="current-password"
            label="Senha Atual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <FloatingLabelInput
            id="new-password"
            label="Nova Senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <FloatingLabelInput
            id="confirm-new-password"
            label="Confirmar Nova Senha"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#4455a3] text-white p-2 rounded-md shadow-sm hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1"
          >
            Alterar Senha
          </button>
        </form>
      </FormWrapper>
    </div>
  );
};

export default ProfileManagementForm;
