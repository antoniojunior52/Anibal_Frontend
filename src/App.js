// App.js
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";

// API Service
import apiService from "./apiService";

// Hooks
import { loadSheetJS } from "./hooks";

// UI Components
import Notification from "./components/ui/Notification";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import PageTitle from "./components/ui/PageTitle";
import PageWrapper from "./components/ui/PageWrapper";
import CustomFileInput from "./components/ui/CustomFileInput";
import ConfirmationModal from "./components/ui/ConfirmationModal";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Modal from "./components/ui/Modal";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";

// REMOVER: Importar o CSS do react-datepicker e o seu CSS personalizado
// import "react-datepicker/dist/react-datepicker.css";
// import "./styles/datepicker-custom.css";

// IMPORTAR: MUI LocalizationProvider e AdapterDateFns para o DatePicker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale'; // Importar o locale português do date-fns


// Page Components
import HomePage from "./components/pages/HomePage";
import NewsPage from "./components/pages/NewsPage";
import NewsDetailPage from "./components/pages/NewsDetailPage";
import MenuPage from "./components/pages/MenuPage";
import SchedulesPage from "./components/pages/SchedulesPage";
import TeachersPage from "./components/pages/TeachersPage";
import HistoryPage from "./components/pages/HistoryPage";
import EventsPage from "./components/pages/EventsPage";
import GalleryPage from "./components/pages/GalleryPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import NoticesPage from "./components/pages/NoticesPage";

// Dashboard Components
import DashboardHome from "./components/dashboard/DashboardHome";
import ProfileManagementForm from "./components/dashboard/ProfileManagementForm";
import NewsFormFull from "./components/dashboard/NewsFormFull";
import TeamFormFull from "./components/dashboard/TeamFormFull";
import HistoryFormFull from "./components/dashboard/HistoryFormFull";
import EventsFormFull from "./components/dashboard/EventsFormFull";
import GalleryFormFull from "./components/dashboard/GalleryFormFull";
import MenuFormFull from "./components/dashboard/MenuFormFull";
import SchedulesFormFull from "./components/dashboard/SchedulesFormFull";
import UserManagementFull from "./components/dashboard/UserManagementFull";
import UserRegistrationForm from "./components/dashboard/UserRegistrationForm";
import NoticeFormFull from "./components/dashboard/NoticeFormFull";


export const API_URL = "http://localhost:5000"; // Export API_URL for use in other components

export default function App() {
  // --- Estados da Aplicação ---
  const [page, setPage] = useState("home");
  const [pagePayload, setPagePayload] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // --- Estados dos Dados ---
  const [news, setNews] = useState([]);
  const [notices, setNotices] = useState([]);
  const [menuUrl, setMenuUrl] = useState("");
  const [schedules, setSchedules] = useState({});
  const [team, setTeam] = useState([]);
  const [history, setHistory] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [users, setUsers] = useState([]);

  // --- Estados para Notificação e Modais ---
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmModalCallback, setConfirmModalCallback] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Estado para o modal genérico
  const [showGenericModal, setShowGenericModal] = useState(false);
  const [genericModalTitle, setGenericModalTitle] = useState("");
  const [genericModalContent, setGenericModalContent] = useState(null);

  // NOVO ESTADO para controlar se os usuários já foram buscados (para evitar loops)
  const [hasFetchedUsers, setHasFetchedUsers] = useState(false);


  // Função para abrir o modal genérico
  const openGenericModal = useCallback((title, content) => {
    setGenericModalTitle(title);
    setGenericModalContent(content);
    setShowGenericModal(true);
  }, []);

  // Função para fechar o modal genérico
  const closeGenericModal = useCallback(() => {
    setShowGenericModal(false);
    setGenericModalTitle("");
    setGenericModalContent(null);
  }, []);


  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 4000);
  }, []);

  // --- Funções de Carregamento de Dados ---
  const fetchAllData = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const [
        newsData,
        noticesData,
        teamData,
        historyData,
        eventsData,
        galleryData,
        menuData,
        schedulesData,
      ] = await Promise.all([
        apiService.get("/api/news"),
        apiService.get("/api/notices"),
        apiService.get("/api/team"),
        apiService.get("/api/history"),
        apiService.get("/api/events"),
        apiService.get("/api/gallery"),
        apiService.get("/api/menu").catch(() => ({ fileUrl: "" })),
        apiService.get("/api/schedules").catch(() => ({})),
      ]);
      setNews(newsData);
      setNotices(noticesData);
      setTeam(teamData);
      setHistory(historyData);
      setEvents(eventsData);
      setGallery(galleryData);
      setMenuUrl(menuData.fileUrl || "");
      setSchedules(schedulesData || {});
    } catch (error) {
      showNotification("Falha ao carregar os dados do site.", "error");
    } finally {
      setGlobalLoading(false);
    }
  }, [showNotification]);

  const fetchUsers = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const usersData = await apiService.requestWithBody("/api/users", "GET");
      setUsers(usersData);
    } catch (error) {
      if (!error.message.includes("403")) {
        showNotification("Falha ao carregar utilizadores.", "error");
      }
    } finally {
      setGlobalLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadSheetJS();
    fetchAllData();
  }, [fetchAllData]);

  // EFEITO CORRIGIDO PARA EVITAR LOOP INFINITO
  useEffect(() => {
    // Apenas busca usuários se o usuário logado for admin e ainda não tivermos buscado
    if (user?.isAdmin && !hasFetchedUsers) {
      fetchUsers();
      setHasFetchedUsers(true); // Marca como buscado para evitar chamadas repetidas
    } else if (!user?.isAdmin && hasFetchedUsers) {
      // Se o usuário não for mais admin (ex: logout ou permissão alterada), limpa a lista de usuários
      // e reseta a flag para uma futura sessão de admin
      setUsers([]);
      setHasFetchedUsers(false);
    }
  }, [user?.isAdmin, fetchUsers, hasFetchedUsers]); // Dependências ajustadas para evitar loop

  // --- Gestão de Autenticação e Navegação ---
  const navigate = useCallback((targetPage, payload = null) => {
    window.scrollTo(0, 0);
    setPage(targetPage);
    setPagePayload(payload);
  }, []);

  // Função showConfirm que usa o modal personalizado
  const showConfirm = (message) => {
    return new Promise((resolve) => {
      setConfirmModalMessage(message);
      setConfirmModalCallback(() => (confirmed) => {
        setShowConfirmModal(false);
        resolve(confirmed);
      });
      setShowConfirmModal(true);
    });
  };

  const handleLogout = useCallback(
    async (message, type = "info") => {
      const confirmed = await showConfirm("Tem certeza que deseja sair da sua conta?");
      if (!confirmed) {
        showNotification("Logout cancelado.", "info");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("loginTimestamp");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null); // Define user como null no logout
      setUsers([]); // Limpa a lista de usuários no logout
      setHasFetchedUsers(false); // Reseta a flag de usuários buscados
      navigate("home");
      if (message) {
        showNotification(message, type);
      }
    },
    [navigate, showNotification, showConfirm]
  );

  const handleLogin = async (email, password, rememberMe) => {
    setGlobalLoading(true);
    try {
      const { token, user: userData } = await apiService.post("/api/auth/login", {
        email,
        password,
        rememberMe,
      });
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(userData));

      // Atualiza o user, mas o useEffect de fetchUsers agora controla a busca
      setUser(userData);
      setIsLoggedIn(true);
      navigate("dashboard");
      showNotification(
        `Bem-vindo(a) de volta, ${userData.name.split(" ")[0]}!`,
        "success"
      );
    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleRegisterByAdmin = async (newUserData) => {
    setGlobalLoading(true);
    try {
      await apiService.post("/api/auth/register-by-admin", newUserData);
      showNotification("Utilizador criado com sucesso!", "success");
      fetchUsers(); // Chama fetchUsers para atualizar a lista após o registro
    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleProfileUpdate = async (updateData) => {
    setGlobalLoading(true);
    try {
      const endpoint = `/api/users/profile`;
      const updatedUser = await apiService.put(endpoint, updateData);
      const storage = localStorage.getItem("token")
        ? localStorage
        : sessionStorage;
      storage.setItem("user", JSON.stringify(updatedUser));

      // Atualiza o user, mas o useEffect de fetchUsers agora controla a busca
      setUser(updatedUser);
      showNotification("Perfil atualizado com sucesso!", "success");
    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleChangePassword = async (passwordData) => {
    setGlobalLoading(true);
    try {
      await apiService.put("/api/users/change-password", passwordData);
      showNotification("Senha alterada com sucesso!", "success");
    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  // EFEITO CORRIGIDO PARA CARREGAMENTO INICIAL DO USUÁRIO
  useEffect(() => {
    const token = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");

    if (token || sessionToken) {
      const storedUser = token ? localStorage.getItem("user") : sessionStorage.getItem("user");
      const loginTimestamp = localStorage.getItem("loginTimestamp");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const now = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        // Verifica a expiração apenas se o token for do localStorage (lembrar de mim)
        if (token && loginTimestamp && (now - parseInt(loginTimestamp, 10) > twentyFourHours)) {
          handleLogout(
            "Sua sessão expirou por segurança. Por favor, faça login novamente.",
            "info"
          );
        } else {
          // Apenas atualiza o estado 'user' se ele for diferente do atual para evitar re-renders desnecessários
          if (!user || user.id !== parsedUser.id) { // Comparar por ID para evitar re-render por nova referência
            setUser(parsedUser);
          }
          setIsLoggedIn(true);
        }
      } else {
        // Se não há usuário armazenado mas há token, algo está errado, faz logout
        handleLogout("Sessão inválida. Por favor, faça login novamente.", "error");
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setUsers([]); // Garante que a lista de usuários está vazia se não houver token
      setHasFetchedUsers(false); // Reseta a flag
    }
  }, [handleLogout, user]); // Adiciona 'user' como dependência para que a comparação funcione corretamente


  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/reset-password/")) {
      const token = path.split("/")[2];
      navigate("reset-password", token);
    }
  }, [navigate]);

  const handleSave =
    (endpoint, fetchFunction) =>
    async (data, id = null) => {
      const service =
        typeof data.append === "function"
          ? id
            ? apiService.putForm
            : apiService.postForm
          : id
          ? apiService.put
          : apiService.post;
      const url = id ? `${endpoint}/${id}` : endpoint;

      if (id) {
        const confirmed = await showConfirm("Tem a certeza que quer atualizar este item?");
        if (!confirmed) {
          showNotification("Atualização cancelada.", "info");
          return;
        }
      }

      setGlobalLoading(true);
      try {
        await service(url, data);
        if(fetchFunction) fetchFunction();
      } catch (e) {
        showNotification(e.message, "error");
        throw e;
      } finally {
        setGlobalLoading(false);
      }
    };
  
  const handleDelete = (endpoint, fetchFunction) => async (id) => {
    const confirmed = await showConfirm(
      "Tem a certeza que quer apagar este item?"
    );
    if (confirmed) {
      setGlobalLoading(true);
      try {
        await apiService.delete(`${endpoint}/${id}`);
        showNotification("Item removido com sucesso.", "success");
        if(fetchFunction) fetchFunction();
      } catch (e) {
        showNotification(e.message, "error");
      } finally {
        setGlobalLoading(false);
      }
    } else {
      showNotification("Remoção cancelada.", "info");
    }
  };

  // Função para pesquisa global (exemplo)
  const handleGlobalSearch = useCallback((searchTerm) => {
    showNotification(`Pesquisa global por: "${searchTerm}" (Funcionalidade a ser implementada)`, "info");
    // Aqui você implementaria a lógica de pesquisa,
    // como navegar para uma página de resultados de pesquisa
    // ou filtrar dados em tempo real se a página atual for uma lista.
    // Exemplo: navigate('search-results', { query: searchTerm });
  }, [showNotification]);


  const renderPage = () => {
    if (!isLoggedIn && page === "dashboard") {
      return <LoginPage navigate={navigate} showNotification={showNotification} handleLogin={handleLogin} />;
    }

    switch (page) {
      case "home": return <HomePage navigate={navigate} news={news} events={events} />;
      case "register": return <RegisterPage navigate={navigate} showNotification={showNotification} apiService={apiService} />;
      case "news": return <NewsPage news={news} navigate={navigate} />;
      case "notices": return <NoticesPage notices={notices} />;
      case "news-detail":
        const article = news.find((n) => n._id === pagePayload);
        return article ? (<NewsDetailPage article={article} onBack={() => navigate("news")} />) : (<NotFoundPage message="A notícia que você procura não foi encontrada." navigate={navigate} />);
      case "menu": return <MenuPage menuUrl={menuUrl} />;
      case "schedules": return <SchedulesPage schedules={schedules} />;
      case "teachers": return <TeachersPage team={team} />;
      case "history": return <HistoryPage history={history} />;
      case "events": return <EventsPage events={events} />;
      case "gallery": return <GalleryPage gallery={gallery} />;
      case "login": return <LoginPage navigate={navigate} showNotification={showNotification} handleLogin={handleLogin} />;
      case "forgot-password": return <ForgotPasswordPage navigate={navigate} showNotification={showNotification} apiService={apiService} />;
      case "reset-password": return <ResetPasswordPage token={pagePayload} navigate={navigate} showNotification={showNotification} apiService={apiService} />;
      case "dashboard":
        if (!isLoggedIn) return <LoginPage navigate={navigate} showNotification={showNotification} handleLogin={handleLogin} />;
        const backButton = (
          <button onClick={() => navigate("dashboard")} className="mb-8 flex items-center font-semibold text-[#4455a3] hover:opacity-80 transition-all">
            <ArrowLeft size={18} className="mr-2" /> Voltar ao Painel
          </button>
        );
        let dashboardContent;
        switch (pagePayload) {
          case "profile": dashboardContent = <div>{backButton}<ProfileManagementForm user={user} handleProfileUpdate={handleProfileUpdate} handleChangePassword={handleChangePassword} showNotification={showNotification} /></div>; break;
          case "news": dashboardContent = <div>{backButton}<NewsFormFull news={news} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} CustomFileInput={CustomFileInput} /></div>; break;
          case "notices": dashboardContent = <div>{backButton}<NoticeFormFull notices={notices} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} user={user} /></div>; break;
          case "team": dashboardContent = <div>{backButton}<TeamFormFull team={team} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} CustomFileInput={CustomFileInput} /></div>; break;
          case "history": dashboardContent = <div>{backButton}<HistoryFormFull history={history} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} /></div>; break;
          case "events": dashboardContent = <div>{backButton}<EventsFormFull events={events} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} /></div>; break;
          case "gallery": dashboardContent = <div>{backButton}<GalleryFormFull gallery={gallery} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} CustomFileInput={CustomFileInput} /></div>; break;
          case "menu": dashboardContent = <div>{backButton}<MenuFormFull setMenuUrl={setMenuUrl} showNotification={showNotification} apiService={apiService} fetchAllData={fetchAllData} CustomFileInput={CustomFileInput} /></div>; break;
          case "schedules": dashboardContent = <div>{backButton}<SchedulesFormFull schedules={schedules} setSchedules={setSchedules} showNotification={showNotification} apiService={apiService} fetchAllData={fetchAllData} CustomFileInput={CustomFileInput} /></div>; break;
          case "users": dashboardContent = <div>{backButton}<UserManagementFull users={users} user={user} fetchUsers={fetchUsers} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} /></div>; break;
          case "register-user": dashboardContent = <div>{backButton}<UserRegistrationForm handleRegisterByAdmin={handleRegisterByAdmin} /></div>; break;
          default: dashboardContent = <DashboardHome navigate={navigate} user={user} />;
        }
        return (
          <PageWrapper>
            <PageTitle title="Dashboard" subtitle="Administre o conteúdo e as configurações do site." />
            <div className="container mx-auto px-4 pb-12">{dashboardContent}</div>
          </PageWrapper>
        );
      default: return <NotFoundPage navigate={navigate} />;
    }
  };

  return (
    <div className="bg-[#f3f4f6] text-[#1f2937] min-h-screen flex flex-col font-sans antialiased">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
      <Header
        onNavigate={navigate}
        onLogin={() => navigate("login")}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onGlobalSearch={handleGlobalSearch}
      />
      <main className="flex-grow">
        {globalLoading && <LoadingSpinner message="A carregar dados..." size="lg" />}
        {/* LocalizationProvider deve envolver os componentes que usam DatePicker */}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          {renderPage()}
        </LocalizationProvider>
      </main>
      <Footer />
      <ConfirmationModal
        isOpen={showConfirmModal}
        message={confirmModalMessage}
        onConfirm={() => confirmModalCallback(true)}
        onCancel={() => confirmModalCallback(false)}
      />
      <Modal
        isOpen={showGenericModal}
        onClose={closeGenericModal}
        title={genericModalTitle}
      >
        {genericModalContent}
      </Modal>
      <ScrollToTopButton />
    </div>
  );
}
