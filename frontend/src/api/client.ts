import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor per aggiungere il token JWT alle richieste
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor per gestire errori di autenticazione
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Lazy import per evitare dipendenze circolari
      const { useAuthStore } = await import("@/stores/auth");
      const authStore = useAuthStore();
      authStore.logout(); // Sincronizza stato Pinia + localStorage
    }
    return Promise.reject(error);
  }
);

export default apiClient;
