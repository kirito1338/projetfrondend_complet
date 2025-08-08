import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api';
import { API_URL } from '../utils/helpers';

export default function useConducteurData() {
  const [trajets, setTrajets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const currentUserId = userData ? JSON.parse(userData).id_user : null;
  
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTrajets = async () => {
    setLoading(true);
    try {
      console.log("Appel URL:", `${API_URL}/api/Conducteur/mesTrajets`);
      const res = await axios.get(`${API_URL}/api/Conducteur/mesTrajets`, axiosConfig);
      setTrajets(res.data);
    } catch (error) {
      console.error("Erreur chargement trajets", error);
      alert("Erreur chargement trajets. Veuillez vérifier votre connexion ou authentification.");
    }
    setLoading(false);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      console.log("Récupération des messages reçus pour l'utilisateur:", currentUserId);
      const res = await axios.get(`${API_URL}/api/messages/received`, axiosConfig);
      console.log("Messages reçus:", res.data);
      setMessages(res.data);
    } catch (error) {
      console.error(" Erreur chargement messages:", error);
      alert("Erreur chargement messages.");
    }
    setLoading(false);
  };

  const fetchNames = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/all_names`, axiosConfig);
      const mapping = {};
      res.data.forEach(u => {
        mapping[u.id] = u.nom;
      });
      setUserNames(mapping);
    } catch (err) {
      console.error("Erreur récupération noms utilisateurs", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const resUser = await api.get("/api/users/me");
      const userId = resUser.data.id_user;

      const res = await api.get(`/api/notifications/user/${userId}`);

      for (const notif of res.data) {
        const toast = await import('react-toastify');
        toast.toast.info(
          <div>
            <strong>{notif.titre}</strong>
            <p>{notif.message}</p>
          </div>,
          {
            position: "bottom-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        await api.delete(`/api/notifications/${notif.id_notification}`);
      }
    } catch (err) {
      console.error("Erreur chargement notifications:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNames();
      fetchNotifications();
      fetchTrajets();
      fetchMessages();
    }
  }, [token]);

  return {
    trajets,
    setTrajets,
    messages,
    setMessages,
    userNames,
    loading,
    fetchTrajets,
    fetchMessages,
    token,
    axiosConfig,
    currentUserId
  };
}
