import { API_URL } from '../config'; 

// Classe de Erro personalizada para transportar status HTTP e mensagens da API
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Objeto central que gerencia todas as requisições HTTP (fetch)
const apiService = {
  // Método simplificado para requisições GET
  get: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) {
      throw new Error(`Erro HTTP! Status: ${res.status}`);
    }
    return res.json();
  },
  
  // Método genérico para requisições com corpo (POST, PUT, DELETE)
  requestWithBody: async (endpoint, method, data, isFormData = false) => {
    // Pega o token salvo (Login) para autenticação
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const headers = {};
    
    // Se não for arquivo (FormData), define como JSON
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    // Adiciona o token no cabeçalho se existir
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    // Tenta ler o JSON da resposta, mesmo se deu erro (para pegar a mensagem do backend)
    let responseData;
    try {
      responseData = await res.json();
    } catch (e) {
      responseData = { msg: `Erro HTTP! Status: ${res.status}` };
    }

    // Se a resposta não for OK (200-299), lança o erro personalizado
    if (!res.ok) {
      throw new ApiError(
        responseData.msg || `Erro HTTP! Status: ${res.status}`,
        res.status,
        responseData
      );
    }
    
    return responseData;
  },
  
  // Atalhos para os métodos HTTP
  post: (endpoint, data) => apiService.requestWithBody(endpoint, "POST", data),
  put: (endpoint, data) => apiService.requestWithBody(endpoint, "PUT", data),
  delete: (endpoint) => apiService.requestWithBody(endpoint, "DELETE", {}),
  
  // Atalhos específicos para envio de arquivos (FormData)
  postForm: (endpoint, formData) =>
    apiService.requestWithBody(endpoint, "POST", formData, true),
  putForm: (endpoint, formData) =>
    apiService.requestWithBody(endpoint, "PUT", formData, true),
};

export default apiService;