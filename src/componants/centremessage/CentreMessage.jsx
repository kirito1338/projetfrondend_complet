import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import api from "../../api";
import MessageBox from "../MessageBox";
import { useLang } from "../../LangContext";

const CentreMessage = ({ user, isOpen, onClose }) => {
  const [allMessages, setAllMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [userNames, setUserNames] = useState({});
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { t } = useLang();

  useEffect(() => {
    console.log("=== EFFET allMessages CHANGÉ ===");
    console.log("Nouvel état allMessages:", allMessages);
    console.log("Longueur:", allMessages.length);
  }, [allMessages]);

  const getUserName = async (userId) => {
    if (!userId) return "Utilisateur inconnu";
    
    if (userNames[userId]) {
      return userNames[userId];
    }

    try {
      const response = await api.get(`/api/users/${userId}`);
      const userName = response.data.prenom || response.data.nom || response.data.email || "Utilisateur inconnu";
      
      setUserNames(prev => ({
        ...prev,
        [userId]: userName
      }));
      
      return userName;
    } catch (error) {
      console.error("Erreur récupération nom utilisateur:", error);
      return "Utilisateur inconnu";
    }
  };

  const getLastMessageDate = (message) => {
    if (message.type === 'notification' || message.type === 'programmé') {
      return message.date_notification || message.date_programmation || message.dateEnvoi || message.date_envoi;
    }
    
    if (message.type === 'message' && message.idExpediteur) {
      const currentUserId = user.id_user;
      const otherUserId = message.idExpediteur === currentUserId ? message.idDestinataire : message.idExpediteur;
      
      const myMessages = allMessages.filter(msg => 
        msg.type === 'message' && 
        msg.idExpediteur === currentUserId && 
        msg.idDestinataire === otherUserId
      );
      
      const lastMyMessageDate = myMessages.reduce((latest, msg) => {
        const msgDate = new Date(msg.dateEnvoi || msg.date_envoi || 0);
        const latestDate = new Date(latest || 0);
        return msgDate > latestDate ? (msg.dateEnvoi || msg.date_envoi) : latest;
      }, null);
      
      return lastMyMessageDate || message.dateEnvoi || message.date_envoi;
    }
    
    return message.dateEnvoi || message.date_envoi;
  };

  const filterMessagesByDate = (messages, filter) => {
    if (filter === 'all') return messages;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return messages.filter(message => {
      const dateStr = getLastMessageDate(message);
      
      if (!dateStr) return false;
      
      const messageDate = new Date(dateStr);
      
      if (isNaN(messageDate.getTime())) return false;

      switch (filter) {
        case 'today':
          return messageDate >= startOfToday;
        case 'week':
          return messageDate >= startOfWeek;
        case 'month':
          return messageDate >= startOfMonth;
        default:
          return true;
      }
    });
  };

  const filterMessagesByType = (messages, filter) => {
    if (filter === 'all') return messages;
    return messages.filter(message => message.type === filter);
  };

  useEffect(() => {
    let filtered = allMessages;
    
    filtered = filterMessagesByType(filtered, typeFilter);
    
    filtered = filterMessagesByDate(filtered, dateFilter);
    
    const sortedFiltered = filtered.sort((a, b) => {
      const dateA = new Date(getLastMessageDate(a) || 0);
      const dateB = new Date(getLastMessageDate(b) || 0);
      return dateB - dateA;
    });
    
    setFilteredMessages(sortedFiltered);
  }, [allMessages, dateFilter, typeFilter]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;

      try {
        let userId = user.id_user;
        if (!userId) {
          const userRes = await api.get('/api/users/me');
          userId = userRes.data.id_user;
          const updatedUser = { ...user, ...userRes.data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        if (!userId) {
          console.warn("Impossible de récupérer l'ID utilisateur");
          return;
        }

        console.log("Récupération des messages pour userId:", userId); 

        const [notifRes, progRes, msgRes] = await Promise.all([
          api.get(`/api/notifications/user/${userId}`),
          api.get(`/api/messages/programmes/user/${userId}`),
          api.get(`/api/messages/received/${userId}`),
        ]);

        console.log("=== DEBUG CENTRE MESSAGES ===");
        console.log("Messages reçus bruts:", msgRes.data);
        console.log("Type de msgRes.data:", typeof msgRes.data, "Array?", Array.isArray(msgRes.data));
        console.log("Notifications reçues:", notifRes.data);
        console.log("Messages programmés:", progRes.data);

        const enrichedMessages = [];
        
        if (notifRes.data && Array.isArray(notifRes.data)) {
          console.log("Ajout de", notifRes.data.length, "notifications");
          enrichedMessages.push(...notifRes.data.map((n) => ({ type: "notification", ...n })));
        }
        
        if (progRes.data && Array.isArray(progRes.data)) {
          console.log("Ajout de", progRes.data.length, "messages programmés");
          enrichedMessages.push(...progRes.data.map((p) => ({ type: "programmé", ...p })));
        }
        
        if (msgRes.data && Array.isArray(msgRes.data)) {
          console.log("Traitement de", msgRes.data.length, "messages");
          msgRes.data.forEach(msg => {
            console.log("Message individuel:", msg);
            let expediteurName = "Système";
            
            if (msg.nomExpediteur) {
              expediteurName = msg.nomExpediteur;
            } else if (msg.idExpediteur) {
              expediteurName = `Utilisateur ${msg.idExpediteur}`;
            }
            
            const enrichedMsg = { 
              type: "message", 
              ...msg, 
              expediteurName 
            };
            console.log("Message enrichi:", enrichedMsg);
            enrichedMessages.push(enrichedMsg);
          });
        } else {
          console.log("msgRes.data n'est pas un array ou est null/undefined");
        }

        console.log("Messages enrichis final:", enrichedMessages);
        console.log("Nombre total de messages:", enrichedMessages.length);
        setAllMessages(enrichedMessages);
      } catch (err) {
        console.error("Erreur chargement centre de messages :", err);
      }
    };

    let interval;
    if (isOpen && user) {
      fetchAll();
      interval = setInterval(fetchAll, 2000);
    }
    return () => interval && clearInterval(interval);
  }, [isOpen, user, userNames]);// Ajout de userNames dans les dependances

  if (!isOpen) return null;

  return (
    <>
      {selectedMessage && (
        <MessageBox
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
      <div className={`fixed top-0 right-0 h-full w-[450px] bg-white shadow-xl border-l transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
            <Bell /> {t("centreMessages")}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        {/* Filtres par date et type */}
        <div className="p-4 border-b bg-gray-50 space-y-4">
          {/* Filtres par date */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtrer par date :</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Tout', icon: '📅' },
                { key: 'today', label: "Aujourd'hui", icon: '📍' },
                { key: 'week', label: 'Cette semaine', icon: '🗓️' },
                { key: 'month', label: 'Ce mois', icon: '📆' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setDateFilter(filter.key)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    dateFilter === filter.key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtres par type */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtrer par type :</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Tout', icon: '📬' },
                { key: 'notification', label: 'Notifications', icon: '🔔' },
                { key: 'message', label: 'Messages', icon: '💬' },
                { key: 'programmé', label: 'Programmés', icon: '⏰' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setTypeFilter(filter.key)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    typeFilter === filter.key
                      ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''} trouvé{filteredMessages.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-full space-y-3 pb-20">
          {(() => {
            console.log("=== RENDU CENTRE MESSAGES ===");
            console.log("allMessages dans le rendu:", allMessages);
            console.log("filteredMessages:", filteredMessages);
            console.log("dateFilter actuel:", dateFilter);
            return null;
          })()}
          {filteredMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📭</div>
              {dateFilter === 'all' ? (
                <p>Aucun message pour le moment</p>
              ) : (
                <div>
                  <p>Aucun message pour cette période</p>
                  <button 
                    onClick={() => setDateFilter('all')}
                    className="mt-2 text-blue-500 hover:text-blue-700 text-sm underline"
                  >
                    Voir tous les messages
                  </button>
                </div>
              )}
            </div>
          ) : (
            filteredMessages.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (
                    (item.type === "message" || item.type === "programmé") &&
                    item.idExpediteur
                  ) {
                    setSelectedMessage(item);
                  }
                }}
                className="cursor-pointer p-3 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-lg shadow border-l-4 border-green-600 space-y-1 hover:bg-gradient-to-r hover:from-green-200 hover:to-blue-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="text-xs text-gray-500 font-mono flex justify-between items-center">
                  <span className="bg-gray-200 px-2 py-1 rounded-full">[{item.type}]</span>
                  {item.expediteurName && (
                    <span className="text-blue-600 font-semibold">De: {item.expediteurName}</span>
                  )}
                </div>
                <div className="font-semibold text-sm text-gray-800">{item.titre || item.contenu}</div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <span>
                    {(() => {
                      // Utiliser la date du dernier message pour l'affichage
                      const dateStr = getLastMessageDate(item);
                      if (!dateStr) return 'Date inconnue';
                      
                      const date = new Date(dateStr);
                      if (isNaN(date.getTime())) return 'Date invalide';
                      
                      return date.toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    })()}
                  </span>
                  {item.type === 'message' && (
                    <span className="text-xs text-blue-500 font-medium ml-2">
                      (mon dernier message)
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CentreMessage;
