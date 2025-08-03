import React, { useState } from "react";

export default function Account({ user, onUpdate }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    prenom: user?.prenom || "",
    nom: user?.nom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEdit(false);
    if (onUpdate) onUpdate(form);
    // Ajoute ici un appel API si tu veux sauvegarder côté serveur
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center">
        <div className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full w-32 h-32 flex items-center justify-center shadow-lg mb-6">
          <span className="text-5xl font-bold text-white">
            {form.prenom?.[0]?.toUpperCase()}{form.nom?.[0]?.toUpperCase()}
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 mb-2 tracking-wider">
          Mon compte
        </h2>
        <p className="text-gray-500 mb-8">Gérez vos informations personnelles</p>
        <form className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
              <input
                type="text"
                name="prenom"
                disabled={!edit}
                value={form.prenom}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${edit ? "border-blue-400 focus:ring-2 focus:ring-blue-300" : "border-gray-200 bg-gray-50"} transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
              <input
                type="text"
                name="nom"
                disabled={!edit}
                value={form.nom}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${edit ? "border-blue-400 focus:ring-2 focus:ring-blue-300" : "border-gray-200 bg-gray-50"} transition`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              disabled={!edit}
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${edit ? "border-blue-400 focus:ring-2 focus:ring-blue-300" : "border-gray-200 bg-gray-50"} transition`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              disabled={!edit}
              value={form.telephone}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${edit ? "border-blue-400 focus:ring-2 focus:ring-blue-300" : "border-gray-200 bg-gray-50"} transition`}
            />
          </div>
        </form>
        <div className="flex gap-4 mt-10">
          {edit ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold shadow hover:scale-105 transition"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => setEdit(false)}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition"
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-400 text-white font-bold shadow hover:scale-105 transition"
            >
              Modifier mes infos
            </button>
          )}
        </div>
      </div>
    </div>
  );
}