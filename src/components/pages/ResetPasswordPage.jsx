// components/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import FloatingLabelInput from "../ui/FloatingLabelInput"; // Import FloatingLabelInput

const ResetPasswordPage = ({ navigate, showNotification, apiService, token }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showNotification("As senhas não coincidem.", "error");
      return;
    }
    try {
      const { msg } = await apiService.put(
        `/api/auth/reset-password/${token}`,
        { password }
      );
      showNotification(msg, "success");
      navigate("login");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };
  return (
    <PageWrapper>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Redefinir Nova Senha
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <FloatingLabelInput
              id="new-password"
              label="Nova Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FloatingLabelInput
              id="confirm-new-password"
              label="Confirmar Nova Senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4455a3] shadow-md hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1"
              >
                Redefinir Senha
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ResetPasswordPage;
