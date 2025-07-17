import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // <-- Import pour la navigation

export default function ChercherTrajet() {
  const [trajets, setTrajets] = useState([]); // Initialise comme tableau
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // <-- Hook de navigation

  useEffect(() => {
    fetch("http://localhost:8000/rides/all") // Adapte l'URL si besoin
      .then((res) => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Réponse API trajets:", data);
        if (Array.isArray(data)) {
          setTrajets(data);
        } else if (data && Array.isArray(data.rides)) {
          setTrajets(data.rides);
        } else {
          setTrajets([]);
        }
      })
      .catch((err) => {
        console.error("Erreur fetch trajets:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des trajets...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-700">Mes trajets</h2>
      {trajets.length === 0 && <p>Aucun trajet pour le moment.</p>}
      {trajets.map((t) => (
        <div
          key={t.id}
          className="bg-white p-4 shadow-md rounded-xl flex justify-between items-center"
        >
          <div>
            <h3 className="font-bold text-lg text-blue-800">
              {t.depart} → {t.arrivee}
            </h3>
            <p>
              {t.date} à {t.heure}
            </p>
            <p>Places : {t.places}</p>
            <p>Approuvé : {t.approved ? "Oui" : "Non"}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => navigate(`/consulter-trajet/${t.id}`)}  // <-- Redirection vers la page des détails du trajet
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Voir les détails
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
