import React, { useState } from "react";

const Carriere = ({ onClose }) => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu pourrais envoyer les infos à une API ou un email
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md relative text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-green-400">Postuler chez Covoiturage Pro</h2>
        {submitted ? (
          <div className="text-green-400 text-center py-8">
            Merci pour votre candidature !<br />
            Nous reviendrons vers vous rapidement.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-white">Nom complet</label>
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-white">CV (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={e => setCv(e.target.files[0])}
                required
                className="w-full text-white"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-white">Message (optionnel)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-green-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold transition"
            >
              Envoyer la candidature
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Carriere;