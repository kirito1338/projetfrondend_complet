import { useState, useEffect } from 'react';
import api from '../../api';

export default function useAdminData(selectedSection) {
  const [stats, setStats] = useState({
    users: 0,
    drivers: 0,
    rides: 0,
    pendingRides: 0,
    support: 0,
  });
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [supportMessages, setSupportMessages] = useState([]);
  const [historyRides, setHistoryRides] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        switch (selectedSection) {
          case "dashboard":
            const statsRes = await api.get("/api/admin/stats");
            setStats(statsRes.data);
            break;
          case "users":
            const usersRes = await api.get("/api/users");
            setUsers(usersRes.data);
            break;
          case "trajets":
            const histoRes = await api.get("/api/admin/historique");
            setHistoryRides(histoRes.data);
            break;
          case "support":
            const supportRes = await api.get("/api/messages");
            console.log(supportRes.data); // <--- Ajoute ceci pour voir la vraie clé
            const onlyAdminMessages = supportRes.data.filter(
              msg => msg.idDestinataire === 9
            );
            setSupportMessages(onlyAdminMessages);
            break;
        }
      } catch (error) {
        console.error("Erreur:", error.response?.data || error.message);
      }
    };
    loadData();
  }, [selectedSection]);

  return {
    stats,
    users,
    rides,
    supportMessages,
    historyRides,
    setUsers,
    setSupportMessages,
    setHistoryRides,
    setRides
  };
}
