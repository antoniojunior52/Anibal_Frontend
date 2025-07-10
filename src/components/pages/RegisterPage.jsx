// components/pages/RegisterPage.jsx
import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import FloatingLabelInput from "../ui/FloatingLabelInput"; // Import FloatingLabelInput

const RegisterPage = ({ navigate, showNotification, apiService }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showNotification("As senhas não coincidem.", "error");
      return;
    }
    try {
      await apiService.post("/api/auth/public-register", {
        name,
        email,
        password,
      });
      showNotification(
        "Conta criada com sucesso! Faça login para continuar.",
        "success"
      );
      navigate("login");
    }
    catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Criar nova conta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ou{" "}
              <button
                onClick={() => navigate("login")}
                className="font-medium text-[#4455a3] hover:text-[#3a488a] transition-colors"
              >
                aceda à sua conta existente
              </button>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleRegisterSubmit}>
            <FloatingLabelInput
              id="name-register"
              label="Nome Completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FloatingLabelInput
              id="email-register"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <FloatingLabelInput
                id="password-register"
                label="Senha"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                style={{ top: '50%', transform: 'translateY(-50%)' }} // Adjust button position
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
            <FloatingLabelInput
              id="confirm-password-register"
              label="Confirmar Senha"
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
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UserPlus className="h-5 w-5 text-[#fcc841]" />
                </span>
                Registar
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RegisterPage;
