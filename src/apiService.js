const API_URL = "http://localhost:5000";

const apiService = {
  get: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error(`Erro HTTP! Status: ${res.status}`);
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
    const responseData = await res.json();
    if (!res.ok) {
      throw new Error(responseData.msg || `Erro HTTP! Status: ${res.status}`);
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