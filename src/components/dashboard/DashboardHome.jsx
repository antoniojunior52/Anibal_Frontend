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

const DashboardHome = ({ navigate, user }) => (
  <div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <DashboardCard
        icon={<Settings />}
        title="Gerir Perfil"
        onClick={() => navigate("dashboard", "profile")}
        color="indigo"
      />
      {(user?.isSecretaria || user?.isAdmin) && (
        <>
          <DashboardCard icon={<FileText />} title="Gerir Notícias" onClick={() => navigate("dashboard", "news")} color="teal" />
          <DashboardCard icon={<Megaphone />} title="Gerir Recados" onClick={() => navigate("dashboard", "notices")} color="orange" />
          <DashboardCard icon={<PartyPopper />} title="Gerir Eventos" onClick={() => navigate("dashboard", "events")} color="pink" />
          <DashboardCard icon={<Camera />} title="Gerir Galeria" onClick={() => navigate("dashboard", "gallery")} color="sky" />
          <DashboardCard icon={<UtensilsCrossed />} title="Gerir Cardápio" onClick={() => navigate("dashboard", "menu")} color="red" />
          <DashboardCard icon={<FileSpreadsheet />} title="Gerir Horários" onClick={() => navigate("dashboard", "schedules")} color="green" />
        </>
      )}
      {user?.isAdmin && (
        <>
          <DashboardCard icon={<Users />} title="Gerir Equipe" onClick={() => navigate("dashboard", "team")} color="purple" />
          <DashboardCard icon={<Milestone />} title="Gerir História" onClick={() => navigate("dashboard", "history")} color="yellow" />
          <DashboardCard icon={<UserCog />} title="Gerir Utilizadores" onClick={() => navigate("dashboard", "users")} color="orange" />
          <DashboardCard icon={<UserPlus />} title="Cadastrar Utilizador" onClick={() => navigate("dashboard", "register-user")} color="blue" />
        </>
      )}
      {!user?.isSecretaria && !user?.isAdmin && (
        <p className="col-span-full text-center text-gray-500">
          Não tem permissões para gerir conteúdo.
        </p>
      )}
    </div>
  </div>
);

export default DashboardHome;
