import React from "react";

const FallbackNotice = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-start">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-lg mr-2">⚠️</span>
              <h4 className="font-medium">Connexion en mode dégradé</h4>
            </div>
            <p className="text-sm mt-1">
              Connexion réussie avec Google, mais la vérification par email n'est pas disponible temporairement.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default FallbackNotice;
