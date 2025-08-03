import React from "react";

const APropos = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-10 relative animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
      >
        ×
      </button>
      <h2 className="text-3xl font-extrabold text-green-700 mb-4 text-center tracking-tight">
        🚗 À propos de Commevoiturage
      </h2>
      <div className="text-gray-700 text-lg leading-relaxed space-y-4">
        <p>
          <span className="font-bold text-green-700">Commevoiturage+</span> est né d’une idée simple : <span className="italic">rendre le partage de trajets plus humain, plus sûr et plus fun</span>.
        </p>
        <p>
          L’aventure commence en 2025, quand une équipe de passionnés décide de créer une plateforme moderne, intuitive et écoresponsable pour connecter étudiants, travailleurs et voyageurs.
        </p>
        <p>
          Ici, chaque trajet est une opportunité de rencontre, d’économie et de respect de la planète. Notre mission : <span className="font-semibold text-green-700">faciliter la mobilité, encourager la solidarité et réduire l’empreinte carbone</span>.
        </p>
        <div className="flex justify-center my-6">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
            alt="Commevoiturage"
            className="rounded-2xl shadow-lg w-64"
          />
        </div>
        <p>
          Merci de faire partie de la communauté <span className="font-bold text-green-700">Commevoiturage</span> ! Ensemble, roulons vers un avenir plus vert 🌱.
        </p>
      </div>
    </div>
  </div>
);

export default APropos;