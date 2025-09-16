// components/dashboard/ProfileManagementForm.jsx

import React, { useState, useEffect } from "react";
import FormWrapper from "../ui/FormWrapper";
import { UserCircle, Lock, Eye, EyeOff } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import PasswordStrengthMeter from '../ui/PasswordStrengthMeter';
import { AnimatePresence } from 'framer-motion';
import LoadingSpinner from "../ui/LoadingSpinner";

const ProfileManagementForm = ({ user, handleProfileUpdate, handleChangePassword, showNotification }) => {
  // Estados para o formulário de informações
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loadingInfo, setLoadingInfo] = useState(false);

  // Estados para o formulário de senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Estados para a UI da senha
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [validations, setValidations] = useState({
    minLength: false, hasUpper: false, hasLower: false, hasNumber: false, passwordsMatch: false,
  });

  useEffect(() => {
    setValidations({
      minLength: newPassword.length >= 8,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      passwordsMatch: newPassword !== "" && newPassword === confirmNewPassword,
    });
  }, [newPassword, confirmNewPassword]);

  const isNewPasswordValid = Object.values(validations).every(Boolean);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoadingInfo(true);
    try {
      await handleProfileUpdate({ name, email });
    } finally {
      setLoadingInfo(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!isNewPasswordValid) {
      showNotification("A sua nova senha não cumpre todos os critérios de segurança.", "error");
      return;
    }
    setLoadingPassword(true);
    try {
      await handleChangePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulário de Informações do Perfil */}
      <FormWrapper title="Informações do Perfil" icon={<UserCircle className="mr-2 text-[#4455a3]" />}>
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <FloatingLabelInput id="profile-name" label="Nome" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <FloatingLabelInput id="profile-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit" disabled={loadingInfo} className="w-full flex justify-center bg-[#4455a3] text-white p-2 rounded-md shadow-sm hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loadingInfo ? <LoadingSpinner size="sm" /> : 'Salvar Informações'}
          </button>
        </form>
      </FormWrapper>

      {/* Formulário de Alteração de Senha */}
      <FormWrapper title="Alterar Senha" icon={<Lock className="mr-2 text-[#4455a3]" />}>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="relative password-input-wrapper">
            <FloatingLabelInput id="current-password" label="Senha Atual" type={showCurrentPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
              {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className="relative password-input-wrapper">
            <FloatingLabelInput id="new-password" label="Nova Senha" type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} required />
            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
              {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          
          <FloatingLabelInput id="confirm-new-password" label="Confirmar Nova Senha" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} required />

          <AnimatePresence>
            {(isPasswordFocused || newPassword.length > 0) && (
              <PasswordStrengthMeter validations={validations} />
            )}
          </AnimatePresence>
          
          <button type="submit" disabled={!isNewPasswordValid || loadingPassword} className="w-full flex justify-center bg-[#4455a3] text-white p-2 rounded-md shadow-sm hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loadingPassword ? <LoadingSpinner size="sm" /> : 'Alterar Senha'}
          </button>
        </form>
      </FormWrapper>
    </div>
  );
};

export default ProfileManagementForm;