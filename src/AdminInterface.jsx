import { useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaCar,
  FaEnvelope,
  FaCogs,
  FaSignOutAlt,
  FaCheck,
  FaReply,
  FaTrash,
} from "react-icons/fa";

export default function AdminInterface() {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [supportMessages, setSupportMessages] = useState([
    {
      id: 1,
      auteur: "Étudiant Ahmed",
      message: "Je n'arrive pas à réserver un trajet.",
      date: "2025-07-03",
      reponse: "",
      traite: false,
    },
    {
      id: 2,
      auteur: "Conducteur Sarah",
      message: "Je veux changer mes horaires.",
      date: "2025-07-04",
      reponse: "",
      traite: false,
    },
  ]);

  const handleReply = (id, reponse) => {
    setSupportMessages((msgs) =>
      msgs.map((m) => (m.id === id ? { ...m, reponse } : m))
    );
  };

  const handleMarkAsDone = (id) => {
    setSupportMessages((msgs) =>
      msgs.map((m) => (m.id === id ? { ...m, traite: true } : m))
    );
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">📊 Tableau de bord</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Trajets proposés" value="124" />
              <StatCard title="Utilisateurs inscrits" value="850" />
              <StatCard title="Trajets à valider" value="5" />
              <StatCard title="Demandes de support" value={supportMessages.length} />
            </div>
          </div>
        );
      case "users":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">👥 Gestion des utilisateurs</h2>
            <div className="bg-white shadow rounded-lg p-4 space-y-3">
              {[
                { nom: "Jean Dupont", role: "Étudiant" },
                { nom: "Sarah Morin", role: "Conducteur" },
              ].map((u, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{u.nom}</p>
                    <p className="text-sm text-gray-500">{u.role}</p>
                  </div>
                  <div className="space-x-2">
                    <button className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600">
                      Voir
                    </button>
                    <button className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600">
                      Modifier
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "trajets":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">🚗 Gestion des trajets</h2>
            <div className="bg-white shadow rounded-lg p-4 space-y-3">
              {[
                { id: 1, trajet: "Montréal → Laval", date: "2025-07-06", heure: "14h" },
                { id: 2, trajet: "Longueuil → UQAM", date: "2025-07-08", heure: "9h" },
              ].map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{t.trajet}</p>
                    <p className="text-sm text-gray-500">
                      {t.date} à {t.heure}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600">
                      Modérer
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "support":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">📩 Support</h2>
            {supportMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white shadow p-4 rounded-lg space-y-2"
              >
                <p className="font-medium">
                  {msg.auteur} •{" "}
                  <span className="text-sm text-gray-500">{msg.date}</span>
                </p>
                <p>{msg.message}</p>
                {msg.traite ? (
                  <p className="text-green-600 font-semibold">✅ Traité</p>
                ) : (
                  <>
                    <textarea
                      className="border w-full p-2 rounded mt-2"
                      placeholder="Répondre au message..."
                      value={msg.reponse}
                      onChange={(e) =>
                        handleReply(msg.id, e.target.value)
                      }
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        onClick={() => handleMarkAsDone(msg.id)}
                      >
                        <FaCheck /> Marquer comme traité
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        <FaReply /> Répondre
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        );
      case "parametres":
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">⚙️ Paramètres administrateur</h2>

            <div className="bg-white shadow p-6 rounded space-y-4">
              <h3 className="font-semibold text-lg">Changer le mot de passe</h3>
              <input type="password" placeholder="Ancien mot de passe" className="border w-full p-2 rounded" />
              <input type="password" placeholder="Nouveau mot de passe" className="border w-full p-2 rounded" />
              <input type="password" placeholder="Confirmer le mot de passe" className="border w-full p-2 rounded" />
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Mettre à jour</button>
            </div>

            <div className="bg-white shadow p-6 rounded space-y-4">
              <h3 className="font-semibold text-lg">Ajouter un administrateur</h3>
              <input type="text" placeholder="Nom complet" className="border w-full p-2 rounded" />
              <input type="email" placeholder="Adresse e-mail" className="border w-full p-2 rounded" />
              <input type="password" placeholder="Mot de passe" className="border w-full p-2 rounded" />
              <input type="password" placeholder="Confirmer le mot de passe" className="border w-full p-2 rounded" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ajouter</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Admin - Covoiturage+</h1>
        <nav className="flex flex-col space-y-2">
          <SidebarItem icon={<FaTachometerAlt />} label="Tableau de bord" onClick={() => setSelectedSection("dashboard")} active={selectedSection === "dashboard"} />
          <SidebarItem icon={<FaUsers />} label="Utilisateurs" onClick={() => setSelectedSection("users")} active={selectedSection === "users"} />
          <SidebarItem icon={<FaCar />} label="Trajets" onClick={() => setSelectedSection("trajets")} active={selectedSection === "trajets"} />
          <SidebarItem icon={<FaEnvelope />} label="Support" onClick={() => setSelectedSection("support")} active={selectedSection === "support"} />
          <SidebarItem icon={<FaCogs />} label="Paramètres" onClick={() => setSelectedSection("parametres")} active={selectedSection === "parametres"} />
          <SidebarItem icon={<FaSignOutAlt />} label="Déconnexion" onClick={() => alert("Déconnecté")} />
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function SidebarItem({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded transition-all duration-200 ${
        active ? "bg-blue-600" : "hover:bg-blue-700"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}
