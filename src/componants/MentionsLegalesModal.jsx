import React from "react";

const MentionsLegalesModal = ({ type, onClose }) => {
  let title = "";
  let content = "";

  switch (type) {
    case "cgu":
      title = "Conditions générales";
      content = "Voici les conditions générales d'utilisation de Covoiturage Pro...";
      break;
    case "privacy":
      title = "Politique de confidentialité";
      content = "Voici la politique de confidentialité de Covoiturage Pro...";
      break;
    case "access":
      title = "Accessibilité";
      content = "Voici notre politique d’accessibilité...";
      break;
    case "transparency":
      title = "Transparence";
      content = "Voici notre engagement pour la transparence...";
      break;
    default:
      title = "";
      content = "";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-lg relative text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-green-400">{title}</h2>
        <div className="text-white whitespace-pre-line">{content}</div>
      </div>
    </div>
  );
};

export default MentionsLegalesModal;