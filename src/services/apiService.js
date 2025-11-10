import { API_URL } from '../config'; 

// Função helper para criar um erro personalizado
// Isso nos permite passar o status e os dados da resposta para o App.js
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const apiService = {
  get: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) {
      // Lança um erro simples para GET, pois não esperamos corpo
      throw new Error(`Erro HTTP! Status: ${res.status}`);
    }
    return res.json();
  },
  
  requestWithBody: async (endpoint, method, data, isFormData = false) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const headers = {};
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    // Tenta ler a resposta JSON, mesmo se for um erro
    // Isso é crucial para obter { msg, needsVerification }
    let responseData;
    try {
      responseData = await res.json();
    } catch (e) {
      // Se a resposta de erro não for JSON (ex: 500 sem JSON)
      responseData = { msg: `Erro HTTP! Status: ${res.status}` };
    }

    // *** A CORREÇÃO ESTÁ AQUI ***
    if (!res.ok) {
      // Em vez de 'throw new Error(message)',
      // Lançamos nosso erro personalizado com todos os dados
      throw new ApiError(
        responseData.msg || `Erro HTTP! Status: ${res.status}`,
        res.status,
        responseData
      );
    }
    
    return responseData;
  },
  
  post: (endpoint, data) => apiService.requestWithBody(endpoint, "POST", data),
  put: (endpoint, data) => apiService.requestWithBody(endpoint, "PUT", data),
  delete: (endpoint) => apiService.requestWithBody(endpoint, "DELETE", {}),
  postForm: (endpoint, formData) =>
    apiService.requestWithBody(endpoint, "POST", formData, true),
  putForm: (endpoint, formData) =>
    apiService.requestWithBody(endpoint, "PUT", formData, true),
};

export default apiService;