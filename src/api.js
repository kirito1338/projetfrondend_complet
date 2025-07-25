import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Ajout automatique du token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ou AsyncStorage.getItem si tu es en React Native
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
