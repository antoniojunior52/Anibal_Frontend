import React from "react";
import DashboardCard from "../ui/DashboardCard";
import {
  Settings,
  FileText,
  Megaphone,
  PartyPopper,
  Camera,
  UtensilsCrossed,
  FileSpreadsheet,
  Users,
  Milestone,
  UserCog,
  UserPlus,
} from "lucide-react";

// Componente auxiliar para renderizar os títulos das seções do dashboard
const SectionTitle = ({ title }) => (
  <>
    <h3 className="text-xl font-semibold text-gray-700 mt-10 mb-4 pb-2 border-b-2 border-gray-200">
      {title}
    </h3>
  </>
);

// Página Principal do Dashboard
// Renderiza os atalhos para cada função baseando-se nas permissões do usuário
const DashboardHome = ({ navigate, user }) => (
  <div>
    {/* Cabeçalho de boas-vindas com nível de acesso */}
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-[#4455a3]">
      <h2 className="text-2xl font-bold text-gray-800">
        Bem-vindo(a), {user?.name}!
      </h2>
      <p className="text-gray-600">
        Seu nível de acesso é:{" "}
        <span className="font-semibold text-[#4455a3]">
          {user?.isAdmin ? "Administrador" : user?.isSecretaria ? "Secretaria" : "Utilizador"}
        </span>
      </p>
    </div>

    {/* Seção Geral (Disponível para todos) */}
    <SectionTitle title="Geral" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <DashboardCard
        icon={<Settings />}
        title="Gerir Perfil"
        onClick={() => navigate("dashboard", "profile")}
        color="indigo"
      />
    </div>

    {/* Seções para Secretaria e Administrador (Gestão de Conteúdo) */}
    {(user?.isSecretaria || user?.isAdmin) && (
      <>
        {/* Seção de Comunicação e Marketing */}
        <SectionTitle title="Comunicação e Marketing" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <DashboardCard icon={<FileText />} title="Gerir Notícias" onClick={() => navigate("dashboard", "news")} color="teal" />
          <DashboardCard icon={<Megaphone />} title="Gerir Recados" onClick={() => navigate("dashboard", "notices")} color="orange" />
          <DashboardCard icon={<PartyPopper />} title="Gerir Eventos" onClick={() => navigate("dashboard", "events")} color="pink" />
          <DashboardCard icon={<Camera />} title="Gerir Galeria" onClick={() => navigate("dashboard", "gallery")} color="sky" />
        </div>

        {/* Seção de Organização Interna */}
        <SectionTitle title="Organização Interna" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <DashboardCard icon={<UtensilsCrossed />} title="Gerir Cardápio" onClick={() => navigate("dashboard", "menu")} color="red" />
          <DashboardCard icon={<FileSpreadsheet />} title="Gerir Horários" onClick={() => navigate("dashboard", "schedules")} color="green" />
        </div>
      </>
    )}

    {/* Seção apenas para Administrador (Gestão do Sistema) */}
    {user?.isAdmin && (
      <>
        <SectionTitle title="Administração do Sistema" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <DashboardCard icon={<Users />} title="Gerir Equipe" onClick={() => navigate("dashboard", "team")} color="purple" />
          <DashboardCard icon={<Milestone />} title="Gerir História" onClick={() => navigate("dashboard", "history")} color="yellow" />
          <DashboardCard icon={<UserCog />} title="Gerir Utilizadores" onClick={() => navigate("dashboard", "users")} color="orange" />
          {/* <DashboardCard icon={<UserPlus />} title="Cadastrar Utilizador" onClick={() => navigate("dashboard", "register-user")} color="blue" /> */}
        </div>
      </>
    )}

    {/* Mensagem de fallback para utilizadores sem permissões */}
    {!user?.isSecretaria && !user?.isAdmin && (
      <p className="col-span-full text-center text-gray-500 mt-10">
        Não tem permissões para gerir conteúdo.
      </p>
    )}
  </div>
);

export default DashboardHome;