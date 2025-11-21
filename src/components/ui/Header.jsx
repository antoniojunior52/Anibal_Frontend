import React, { useState } from "react";
import { LayoutDashboard, UserCircle, LogOut, Menu } from "lucide-react";
import NavItem from "./NavItem";
import MobileNavItem from "./MobileNavItem";

// Cabeçalho principal da aplicação (Barra de Navegação)
const Header = ({ onNavigate, onLogin, isLoggedIn, onLogout, onGlobalSearch }) => {
  // Estado para controlar se o menu Mobile está aberto ou fechado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função auxiliar para navegar no mobile e fechar o menu automaticamente
  const handleMobileNav = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/90 backdrop-blur-lg shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo e Nome da Escola */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate("home")}
            role="link"
            tabIndex="0"
            aria-label="Ir para a página inicial"
            onKeyPress={(e) => { if (e.key === 'Enter') onNavigate('home'); }}
          >
            <img
              src="/logo.jpg"
              alt="Logo da Escola E.E Profº Anibal do Prado e Silva"
              className="rounded-full w-12 h-12 sm:w-16 sm:h-16 object-cover"
            />
            <h1 className="text-sm sm:text-xl font-bold text-[#4455a3]">
              E.E Profº Anibal do Prado e Silva
            </h1>
          </div>

          {/* Navegação principal (Desktop) - visível apenas em telas 'lg' para cima */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Navegação Principal">
            <NavItem onClick={() => onNavigate("news")}>Notícias</NavItem>
            <NavItem onClick={() => onNavigate("notices")}>Recados</NavItem>
            <NavItem onClick={() => onNavigate("teachers")}>Equipe</NavItem>
            <NavItem onClick={() => onNavigate("history")}>História</NavItem>
            <NavItem onClick={() => onNavigate("events")}>Eventos</NavItem>
            <NavItem onClick={() => onNavigate("gallery")}>Galeria</NavItem>
            <NavItem onClick={() => onNavigate("schedules")}>Horários</NavItem>
            <NavItem onClick={() => onNavigate("menu")}>Cardápio</NavItem>
          </nav>

          {/* Área de Login/Dashboard (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* Botão Dashboard */}
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="flex items-center space-x-2 bg-[#4455a3] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg"
                  aria-label="Ir para o Dashboard"
                >
                  <LayoutDashboard size={18} /> <span>Dashboard</span>
                </button>
                {/* Botão Sair */}
                <button
                  onClick={() => onLogout("Você saiu da sua conta.", "success")}
                  className="text-gray-600 hover:text-[#4455a3] transition duration-300"
                  aria-label="Sair da conta"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              /* Botão Área Restrita (Login) */
              <div className="flex items-center space-x-4">
                <button
                  onClick={onLogin}
                  className="flex items-center space-x-2 bg-[#4455a3] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg"
                  aria-label="Ir para a área restrita"
                >
                  <UserCircle size={18} /> <span>Área Restrita</span>
                </button>
              </div>
            )}
          </div>

          {/* Botão Hambúrguer (Mobile) - visível apenas em telas menores que 'lg' */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#4455a3] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Dropdown (Mobile) - Renderizado apenas se isMenuOpen for true */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white absolute top-20 left-0 w-full shadow-lg z-50" role="menu">
          <nav className="flex flex-col p-4 space-y-2">
            <MobileNavItem onClick={() => handleMobileNav("news")}>Notícias</MobileNavItem>
            <MobileNavItem onClick={() => handleMobileNav("notices")}>Recados</MobileNavItem>
            <MobileNavItem onClick={() => handleMobileNav("teachers")}>Equipe</MobileNavItem>
            <MobileNavItem onClick={() => handleMobileNav("history")}>História</MobileNavItem>
            <MobileNavItem onClick={() => handleMobileNav("events")}>Eventos</MobileNavItem>
            <MobileNavItem onClick={() => handleMobileNav("gallery")}>Galeria</MobileNavItem>
            <MobileNavItem onClick={() => handleMobileNav("schedules")}>Horários</MobileNavItem>
            <MobileNavItem onClick={() => handleMobileNav("menu")}>Cardápio</MobileNavItem>
            <hr className="border-gray-200 my-2" />
            {/* Opções de Login/Logout no Mobile */}
            {isLoggedIn ? (
              <>
                <MobileNavItem onClick={() => handleMobileNav("dashboard")}>Dashboard</MobileNavItem>
                <MobileNavItem
                  onClick={() => {
                    onLogout("Você saiu da sua conta.", "success");
                    setIsMenuOpen(false);
                  }}
                >
                  Sair
                </MobileNavItem>
              </>
            ) : (
              <MobileNavItem
                onClick={() => {
                  onLogin();
                  setIsMenuOpen(false);
                }}
              >
                Área Restrita
              </MobileNavItem>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;