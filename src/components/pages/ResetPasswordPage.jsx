// src/components/pages/ResetPasswordPage.jsx

import React, { useState, useEffect } from "react";
import PageWrapper from "../ui/PageWrapper";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import PasswordStrengthMeter from '../ui/PasswordStrengthMeter';
import { AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = ({ navigate, showNotification, apiService, token }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [validations, setValidations] = useState({
    minLength: false, hasUpper: false, hasLower: false, hasNumber: false, passwordsMatch: false,
  });

  useEffect(() => {
    setValidations({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      passwordsMatch: password !== "" && password === confirmPassword,
    });
  }, [password, confirmPassword]);

  const isFormValid = Object.values(validations).every(Boolean);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      showNotification("Por favor, crie uma senha que cumpra todos os critérios.", "error");
      return;
    }
    try {
      const { msg } = await apiService.put(`/api/auth/reset-password/${token}`, { password });
      showNotification(msg, "success");
      
      // Esta chamada está correta. 
      // Ela vai acionar a nova função 'navigate' no App.js, 
      // que vai trocar o estado para "home" E atualizar a URL para "/".
      navigate("home"); 

    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Redefinir Nova Senha</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="relative password-input-wrapper">
              <FloatingLabelInput
                id="new-password"
                label="Nova Senha"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700">
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            
            <FloatingLabelInput
              id="confirm-new-password"
              label="Confirmar Nova Senha"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              // Correção do erro de digitação (e.targe -> e.target)
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            
            <AnimatePresence>
              {(isPasswordFocused || password.length > 0) && (
                <PasswordStrengthMeter validations={validations} />
              )}
            </AnimatePresence>

            <div>
              <button type="submit" disabled={!isFormValid} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4455a3] shadow-md hover:bg-[#3a488a] transition-all duration-300 transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none">
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