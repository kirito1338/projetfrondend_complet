import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Conducteur = () => {
  const [section, setSection] = useState("accueil");
  const [trajets, setTrajets] = useState([
    {
      id: 1,
      destination: "Montréal → Laval",
      date: "2025-07-05",
      heure: "14:00",
      places: 3,
    },
    {
      id: 2,
      destination: "Montréal → Longueuil",
      date: "2025-07-06",
      heure: "09:30",
      places: 2,
    },
  ]);
  const [messages, setMessages] = useState([
    { id: 1, auteur: "Admin", contenu: "Merci de vérifier vos trajets.", date: "2025-07-01" },
    { id: 2, auteur: "Étudiant Ahmed", contenu: "Peux-tu me déposer à la station Berri?", date: "2025-07-02" },
  ]);
  const [formTrajet, setFormTrajet] = useState({ destination: "", date: "", heure: "", places: "" });
  const [editTrajet, setEditTrajet] = useState(null);
  const [messageForm, setMessageForm] = useState({ destinataire: "", contenu: "" });
  const [settingsForm, setSettingsForm] = useState({ email: "", phone: "", password: "" });
  const etudiantsTemp = ["Étudiant Ahmed", "Étudiante Sarah", "Étudiant Karim", "Administration"];

  const handleAjouterTrajet = () => {
    if (editTrajet !== null) {
      setTrajets(trajets.map(t => t.id === editTrajet ? { ...formTrajet, id: editTrajet } : t));
      setEditTrajet(null);
    } else {
      const newTrajet = { ...formTrajet, id: Date.now() };
      setTrajets([...trajets, newTrajet]);
    }
    setFormTrajet({ destination: "", date: "", heure: "", places: "" });
  };

  const handleModifier = (t) => {
    setFormTrajet({ destination: t.destination, date: t.date, heure: t.heure, places: t.places });
    setEditTrajet(t.id);
    setSection("proposer");
  };

  const handleSupprimer = (id) => {
    setTrajets(trajets.filter((t) => t.id !== id));
  };

  const handleEnvoyerMessage = () => {
    const nouveauMessage = {
      id: Date.now(),
      auteur: "Conducteur",
      contenu: messageForm.contenu,
      date: new Date().toISOString().split("T")[0],
    };
    setMessages([...messages, nouveauMessage]);
    setMessageForm({ destinataire: "", contenu: "" });
  };

  const renderSection = () => {
    return (
      <div className="space-y-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl">
        {section === "accueil" && (
          <>
            <h2 className="text-3xl font-extrabold text-blue-800 drop-shadow-sm">Bienvenue Conducteur 👋</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Trajets", value: trajets.length },
                { label: "Messages Reçus", value: messages.length },
                { label: "Prochains Trajets", value: trajets.filter(t => new Date(t.date) >= new Date()).length },
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-white via-gray-50 to-blue-100 p-6 rounded-xl shadow-xl text-center border border-blue-200">
                  <h3 className="text-lg text-blue-600 font-semibold uppercase tracking-wide">{item.label}</h3>
                  <p className="text-4xl font-bold text-blue-900 mt-2">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="w-full h-72 rounded-xl overflow-hidden shadow-xl mt-6 border-2 border-blue-100">
              <MapContainer
                center={[45.5017, -73.5673]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[45.5017, -73.5673]}>
                  <Popup>Départ depuis Montréal</Popup>
                </Marker>
              </MapContainer>
            </div>
          </>
        )}

        {section === "proposer" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-700">{editTrajet ? "Modifier un trajet" : "Proposer un trajet"}</h2>
            <input type="text" placeholder="Destination" value={formTrajet.destination} onChange={e => setFormTrajet({ ...formTrajet, destination: e.target.value })} className="border p-3 rounded w-full" />
            <input type="date" value={formTrajet.date} onChange={e => setFormTrajet({ ...formTrajet, date: e.target.value })} className="border p-3 rounded w-full" />
            <input type="time" value={formTrajet.heure} onChange={e => setFormTrajet({ ...formTrajet, heure: e.target.value })} className="border p-3 rounded w-full" />
            <input type="number" placeholder="Places disponibles" value={formTrajet.places} onChange={e => setFormTrajet({ ...formTrajet, places: e.target.value })} className="border p-3 rounded w-full" />
            <button onClick={handleAjouterTrajet} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {editTrajet ? "Modifier" : "Ajouter"}
            </button>
          </div>
        )}

        {section === "trajets" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-700">Mes trajets</h2>
            {trajets.map(t => (
              <div key={t.id} className="bg-white p-4 shadow-md rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-blue-800">{t.destination}</h3>
                  <p>{t.date} à {t.heure}</p>
                  <p>Places : {t.places}</p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleModifier(t)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Modifier</button>
                  <button onClick={() => handleSupprimer(t.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {section === "messages" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-700">Messages</h2>
            {messages.map(msg => (
              <div key={msg.id} className="bg-white p-4 rounded shadow">
                <p className="font-bold text-blue-800">{msg.auteur}</p>
                <p>{msg.contenu}</p>
                <p className="text-sm text-gray-500">{msg.date}</p>
              </div>
            ))}
            <div>
              <h3 className="font-semibold mb-2">Envoyer un message</h3>
              <select className="border p-2 rounded w-full mb-2" value={messageForm.destinataire} onChange={e => setMessageForm({ ...messageForm, destinataire: e.target.value })}>
                <option value="">Choisir un destinataire</option>
                {etudiantsTemp.map((e, i) => <option key={i} value={e}>{e}</option>)}
              </select>
              <textarea className="border p-2 rounded w-full mb-2" rows="3" placeholder="Écrire un message..." value={messageForm.contenu} onChange={e => setMessageForm({ ...messageForm, contenu: e.target.value })} />
              <button onClick={handleEnvoyerMessage} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Envoyer</button>
            </div>
          </div>
        )}

        {section === "parametres" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-700">Paramètres du compte</h2>
            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <div>
                <label className="block mb-1 font-medium">Changer l'e-mail</label>
                <input type="email" placeholder="exemple@mail.com" className="border p-3 rounded w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Changer le téléphone</label>
                <input type="tel" placeholder="514-123-4567" className="border p-3 rounded w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Changer le mot de passe</label>
                <input type="password" placeholder="••••••••" className="border p-3 rounded w-full" />
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Enregistrer les modifications</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 text-gray-800">
      <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-3xl font-bold text-blue-800">🚗 Covoiturage</h1>
          <nav className="space-x-4 text-sm">
            {["accueil", "proposer", "trajets", "messages", "parametres"].map((item, i) => (
              <button
                key={i}
                onClick={() => setSection(item)}
                className={`transition font-medium px-3 py-1 rounded hover:bg-blue-100 hover:text-blue-800 ${
                  section === item ? "bg-blue-200 text-blue-900 underline" : "text-gray-700"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
            <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Déconnexion</button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto py-10 px-4">{renderSection()}</main>
    </div>
  );
};

export default Conducteur;
