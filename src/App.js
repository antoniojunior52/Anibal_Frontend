import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Bot } from "lucide-react";

// Serviço para conectar com o Backend (API)
import apiService from "./services/apiService.js";

// Hook personalizado para carregar bibliotecas externas (ex: SheetJS)
import { loadSheetJS } from "./hooks/hooks.js";

// --- NOTIFICAÇÕES MODERNAS (TOASTIFY) ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Componentes de Interface (UI) ---
// O import Notification foi removido pois foi substituído pelo Toastify
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import PageTitle from "./components/ui/PageTitle";
import PageWrapper from "./components/ui/PageWrapper";
import CustomFileInput from "./components/ui/CustomFileInput";
import ConfirmationModal from "./components/ui/ConfirmationModal";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Modal from "./components/ui/Modal";
import AIChatbot from "./components/ui/AIChatbot";
import AccessibilityMenu from "./components/ui/AccessibilityMenu.jsx";

// Configuração de datas para componentes de calendário (Padrão Brasileiro)
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

// --- Páginas Públicas ---
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
import ErrorPage from "./components/pages/ErrorPage";
import NoticesPage from "./components/pages/NoticesPage";
import AlbumDetailPage from "./components/pages/AlbumDetailPage";

// --- Componentes do Painel Administrativo (Dashboard) ---
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

// URL base da API
export const API_URL = "http://localhost:5000";

// Componente Principal que gerencia toda a aplicação
export default function App() {
  // --- ESTADOS DE NAVEGAÇÃO E USUÁRIO ---
  const [page, setPage] = useState("home"); // Controla qual tela está sendo exibida
  const [pagePayload, setPagePayload] = useState(null); // Dados extras para a página (ex: ID de uma notícia)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Se o usuário está logado
  const [user, setUser] = useState(null); // Dados do usuário logado
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // Se o chat está aberto

  // --- ESTADOS DE DADOS DO SITE ---
  const [news, setNews] = useState([]);
  const [notices, setNotices] = useState([]);
  const [menuUrl, setMenuUrl] = useState("");
  const [schedules, setSchedules] = useState({});
  const [team, setTeam] = useState([]);
  const [history, setHistory] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [users, setUsers] = useState([]); // Lista de usuários (apenas admin vê)

  // --- ESTADOS DE UI (Interface) ---
  // O estado 'notification' foi removido pois o Toastify gerencia isso internamente

  // Modal de Confirmação (Sim/Não)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmModalCallback, setConfirmModalCallback] = useState(null);

  // Controle de carregamento global
  const [globalLoading, setGlobalLoading] = useState(false);

  // Modal Genérico para mensagens diversas
  const [showGenericModal, setShowGenericModal] = useState(false);
  const [genericModalTitle, setGenericModalTitle] = useState("");
  const [genericModalContent, setGenericModalContent] = useState(null);

  // Controle para evitar recarregar usuários admin repetidamente
  const [hasFetchedUsers, setHasFetchedUsers] = useState(false);

  // Configurações de Acessibilidade
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  // --- EFEITOS DE ACESSIBILIDADE ---

  // Aplica/Remove a classe de alto contraste no body
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', isHighContrast);
  }, [isHighContrast]);

  // Aplica o tamanho da fonte no HTML raiz
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Carrega preferências salvas no localStorage ao iniciar
  useEffect(() => {
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize'), 10);
    if (savedContrast) setIsHighContrast(true);
    if (!isNaN(savedFontSize)) setFontSize(savedFontSize);
  }, []);

  // Funções de controle de acessibilidade
  const toggleContrast = () => setIsHighContrast(prev => !prev);
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 10, 150));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 10, 80));

  // --- FUNÇÕES DE UI ---

  // Abre um modal genérico com título e conteúdo
  const openGenericModal = useCallback((title, content) => {
    setGenericModalTitle(title);
    setGenericModalContent(content);
    setShowGenericModal(true);
  }, []);

  const closeGenericModal = useCallback(() => {
    setShowGenericModal(false);
    setGenericModalTitle("");
    setGenericModalContent(null);
  }, []);

  // Exibe uma notificação usando React-Toastify
  const showNotification = useCallback((message, type = "info") => {
    const options = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    };

    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "warning":
        toast.warn(message, options);
        break;
      default:
        toast.info(message, options);
        break;
    }
  }, []);

  // --- CARREGAMENTO DE DADOS ---

  // Busca todos os dados públicos do site em paralelo
  const fetchAllData = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const [
        newsData, noticesData, teamData, historyData,
        eventsData, galleryData, menuData, schedulesData,
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

  // Busca a lista de usuários (apenas se for Admin)
  const fetchUsers = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const usersData = await apiService.requestWithBody("/api/users", "GET");
      setUsers(usersData);
    } catch (error) {
      // Ignora erro 403 (sem permissão) para não spamar notificação
      if (!error.message.includes("403")) {
        showNotification("Falha ao carregar utilizadores.", "error");
      }
    } finally {
      setGlobalLoading(false);
    }
  }, [showNotification]);

  // Carrega dados e scripts ao iniciar o app
  useEffect(() => {
    loadSheetJS();
    fetchAllData();
  }, [fetchAllData]);

  // Monitora se o usuário é admin para carregar a lista de usuários
  useEffect(() => {
    if (user?.isAdmin && !hasFetchedUsers) {
      fetchUsers();
      setHasFetchedUsers(true);
    } else if (!user?.isAdmin && hasFetchedUsers) {
      setUsers([]);
      setHasFetchedUsers(false);
    }
  }, [user?.isAdmin, fetchUsers, hasFetchedUsers]);

  // --- NAVEGAÇÃO ---

  // Função principal de navegação (altera estado 'page' e URL)
  const navigate = useCallback((targetPage, payload = null) => {
    window.scrollTo(0, 0);
    setPage(targetPage);
    setPagePayload(payload);

    const path = targetPage === "home" ? "/" : `/${targetPage}`;
    window.history.pushState({ page: targetPage }, "", path);
  }, []);

  // Exibe modal de confirmação e retorna uma Promise (aguarda o clique do usuário)
  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmModalMessage(message);
      setConfirmModalCallback(() => (confirmed) => {
        setShowConfirmModal(false);
        resolve(confirmed);
      });
      setShowConfirmModal(true);
    });
  }, []);

  // --- AUTENTICAÇÃO ---

  // Logout forçado (sem perguntar) - limpa storage e estado
  const forceLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTimestamp");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setUsers([]);
    setHasFetchedUsers(false);
  }, []);

  // Logout com confirmação do usuário
  const handleLogout = useCallback(
    async (message, type = "info") => {
      const confirmed = await showConfirm("Tem certeza que deseja sair da sua conta?");
      if (!confirmed) {
        showNotification("Logout cancelado.", "info");
        return;
      }

      forceLogout();

      navigate("home");
      if (message) {
        showNotification(message, type);
      }
    },
    [navigate, showNotification, showConfirm, forceLogout]
  );

  // Login do usuário 
  const handleLogin = async (email, password, rememberMe) => {
    setGlobalLoading(true);
    try {
      const { token, user: userData } = await apiService.post("/api/auth/login", {
        email, password, rememberMe,
      });

      // Salva token e dados no local ou session storage
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(userData));

      if (rememberMe) {
        localStorage.setItem("loginTimestamp", new Date().getTime());
      }

      setUser(userData);
      setIsLoggedIn(true);
      navigate("dashboard");
      showNotification(`Bem-vindo(a) de volta, ${userData.name.split(" ")[0]}!`, "success");

    } catch (error) {
      // Apenas mostra o erro, sem checar por needsVerification
      showNotification(error.message, "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  // Registro público de novos usuários 
  const handlePublicRegister = async (registerData) => {
    setGlobalLoading(true);
    try {
      await apiService.post("/api/auth/public-register", registerData);
      showNotification("Conta criada com sucesso! Faça login para continuar.", "success");
      navigate("login"); // Redireciona direto para login
    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  // Registro de usuário pelo Admin
  const handleRegisterByAdmin = async (newUserData) => {
    setGlobalLoading(true);
    try {
      const response = await apiService.post("/api/auth/register-by-admin", newUserData);
      showNotification(response.msg || "Utilizador criado com sucesso!", "success");
      fetchUsers(); // Atualiza a lista
      navigate("dashboard", "users");
    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  // Atualização de perfil (Nome/Email)
  const handleProfileUpdate = async (updateData) => {
    setGlobalLoading(true);
    try {
      const endpoint = `/api/users/profile`;
      const responseData = await apiService.put(endpoint, updateData);

      // Se o e-mail mudou, não pede verificação, apenas atualiza
      const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(responseData));
      setUser(responseData);
      showNotification("Perfil atualizado com sucesso!", "success");

    } catch (error) {
      showNotification(error.message, "error");
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  // Alteração de senha
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

  // Verifica sessão ativa ao carregar a página
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

        // Verifica expiração do login "Lembrar de mim"
        if (token && loginTimestamp && (now - parseInt(loginTimestamp, 10) > twentyFourHours)) {
          forceLogout(); // Limpa o storage sem perguntar nada
          showNotification("Sua sessão expirou. Por favor, faça login novamente.", "info");
          navigate("login");
        } else {
          if (!user || user.id !== parsedUser.id) {
            setUser(parsedUser);
          }
          setIsLoggedIn(true);
        }
      } else {
        forceLogout();
        showNotification("Sessão inválida. Por favor, faça login novamente.", "error");
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setUsers([]);
      setHasFetchedUsers(false);
    }
  }, [handleLogout, user, forceLogout]);

  // Redireciona URL de reset de senha vinda do e-mail
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/reset-password/")) {
      const token = path.split("/")[2];
      navigate("reset-password", token);
    }
  }, [navigate]);

  // Função genérica para Salvar/Atualizar dados (CRUD)
  const handleSave = (endpoint, fetchFunction) => async (data, id = null) => {
    const service = typeof data.append === "function"
      ? (id ? apiService.putForm : apiService.postForm)
      : (id ? apiService.put : apiService.post);
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
      showNotification(id ? "Item atualizado com sucesso." : "Item salvo com sucesso.", "success");
      if (fetchFunction) fetchFunction();
    } catch (e) {
      // REMOVIDO: showNotification(e.message, "error"); para evitar duplicação
      throw e; // Repassa o erro para o formulário tratar e mostrar a notificação
    } finally {
      setGlobalLoading(false);
    }
  };

  // Função genérica para Deletar dados (CRUD)
  const handleDelete = useCallback((endpoint, fetchFunction) => async (id) => {
    const confirmed = await showConfirm("Tem a certeza de que deseja apagar este item?");
    if (!confirmed) {
      showNotification("Exclusão cancelada.", "info");
      return;
    }
    setGlobalLoading(true);
    try {
      const url = id ? `${endpoint}/${id}` : endpoint;
      await apiService.delete(url);
      showNotification("Item removido com sucesso.", "success");
      await fetchFunction();
    } catch (e) {
      showNotification(e.message, "error");
    } finally {
      setGlobalLoading(false);
    }
  }, [showNotification, showConfirm]);

  // Placeholder para busca global
  const handleGlobalSearch = useCallback((searchTerm) => {
    showNotification(`Pesquisa global por: "${searchTerm}" (Funcionalidade a ser implementada)`, "info");
  }, [showNotification]);

  // --- RENDERIZAÇÃO DAS PÁGINAS (ROTEAMENTO) ---
  const renderPage = () => {
    if (!isLoggedIn && page === "dashboard") {
      return <LoginPage navigate={navigate} showNotification={showNotification} handleLogin={handleLogin} />;
    }
    switch (page) {
      // --- ROTAS PÚBLICAS ---
      case "home": return <HomePage navigate={navigate} news={news} events={events} />;
      case "register": return <RegisterPage
        navigate={navigate}
        showNotification={showNotification}
        handleRegister={handlePublicRegister}
      />;
      case "news": return <NewsPage news={news} navigate={navigate} />;
      case "notices": return <NoticesPage notices={notices} />;
      case "news-detail":
        const article = news.find((n) => n._id === pagePayload);
        return article ? (<NewsDetailPage article={article} onBack={() => navigate("news")} />) : (<ErrorPage statusCode={404} navigate={navigate} />);
      case "menu": return <MenuPage menuUrl={menuUrl} />;
      case "schedules": return <SchedulesPage schedules={schedules} />;
      case "teachers": return <TeachersPage team={team} />;
      case "history": return <HistoryPage history={history} />;
      case "events": return <EventsPage events={events} />;
      case "gallery": return <GalleryPage gallery={gallery} navigate={navigate} />;
      case "gallery-album": return (<AlbumDetailPage gallery={gallery} albumName={pagePayload} onBack={() => navigate("gallery")} />);
      case "login": return <LoginPage navigate={navigate} showNotification={showNotification} handleLogin={handleLogin} />;
      case "forgot-password": return <ForgotPasswordPage navigate={navigate} showNotification={showNotification} apiService={apiService} />;
      case "reset-password": return <ResetPasswordPage token={pagePayload} navigate={navigate} showNotification={showNotification} apiService={apiService} />;

      // --- ROTAS PRIVADAS (DASHBOARD) ---
      case "dashboard":
        if (!isLoggedIn) return <LoginPage navigate={navigate} showNotification={showNotification} handleLogin={handleLogin} />;

        const backButton = (
          <button onClick={() => navigate("dashboard")} className="mb-8 flex items-center font-semibold text-[#4455a3] hover:opacity-80 transition-all">
            <ArrowLeft size={18} className="mr-2" /> Voltar ao Painel
          </button>
        );
        let dashboardContent;
        const menuDataForComponent = { fileUrl: menuUrl, updatedAt: menuUrl ? 'data_mock' : undefined };

        switch (pagePayload) {
          case "profile": dashboardContent = <div>{backButton}<ProfileManagementForm user={user} handleProfileUpdate={handleProfileUpdate} handleChangePassword={handleChangePassword} showNotification={showNotification} /></div>; break;
          case "news": dashboardContent = <div>{backButton}<NewsFormFull news={news} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} CustomFileInput={CustomFileInput} /></div>; break;
          case "notices": dashboardContent = <div>{backButton}<NoticeFormFull notices={notices} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} user={user} /></div>; break;
          case "team": dashboardContent = <div>{backButton}<TeamFormFull team={team} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} CustomFileInput={CustomFileInput} /></div>; break;
          case "history": dashboardContent = <div>{backButton}<HistoryFormFull history={history} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} /></div>; break;
          case "events": dashboardContent = <div>{backButton}<EventsFormFull events={events} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} /></div>; break;
          case "gallery": dashboardContent = <div>{backButton}<GalleryFormFull gallery={gallery} fetchAllData={fetchAllData} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} CustomFileInput={CustomFileInput} showConfirm={showConfirm} /></div>; break;
          case "menu": dashboardContent = <div>{backButton}<MenuFormFull menu={menuDataForComponent} showNotification={showNotification} apiService={apiService} fetchAllData={fetchAllData} /></div>; break;
          case "schedules": dashboardContent = <div>{backButton}<SchedulesFormFull schedules={schedules} setSchedules={setSchedules} showNotification={showNotification} apiService={apiService} fetchAllData={fetchAllData} CustomFileInput={CustomFileInput} showConfirm={showConfirm} /></div>; break;
          case "users": dashboardContent = <div>{backButton}<UserManagementFull users={users} user={user} fetchUsers={fetchUsers} handleSave={handleSave} handleDelete={handleDelete} showNotification={showNotification} handleRegisterByAdmin={handleRegisterByAdmin} navigate={navigate} apiService={apiService} /></div>; break;

          case "register-user": dashboardContent = <div>{backButton}<UserRegistrationForm
            handleRegisterByAdmin={handleRegisterByAdmin}
            apiService={apiService}
          /></div>; break;

          default: dashboardContent = <DashboardHome navigate={navigate} user={user} />;
        }
        return (
          <PageWrapper>
            <PageTitle title="Dashboard" subtitle="Administre o conteúdo e as configurações do site." />
            <div className="container mx-auto px-4 pb-12">{dashboardContent}</div>
          </PageWrapper>
        );
      default: return <ErrorPage statusCode={404} navigate={navigate} />;
    }
  };

  return (
    <div className="bg-[#f3f4f6] text-[#1f2937] min-h-screen flex flex-col font-sans antialiased">
      {/* ToastContainer substitui o antigo componente Notification */}
      <ToastContainer />
      
      <Header
        onNavigate={navigate}
        onLogin={() => navigate("login")}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onGlobalSearch={handleGlobalSearch}
      />
      <main className="flex-grow">
        {globalLoading && <LoadingSpinner message="A carregar dados..." size="lg" />}
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
      {isChatbotOpen && <AIChatbot onClose={() => setIsChatbotOpen(false)} />}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 left-6 z-50 p-4 rounded-full bg-[#ec9c30] text-white shadow-lg hover:bg-[#d68a2a] transition-all duration-300 transform hover:-translate-y-1"
          aria-label="Abrir assistente virtual"
        >
          <Bot size={24} />
        </button>
      )}
      <AccessibilityMenu
        toggleContrast={toggleContrast}
        increaseFontSize={increaseFontSize}
        decreaseFontSize={decreaseFontSize}
      />
    </div>
  );
}