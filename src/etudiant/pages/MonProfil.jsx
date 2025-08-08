import React from "react";
import { FaUser, FaEdit, FaSave, FaTrash, FaStar } from "react-icons/fa";

const MonProfil = ({ profil, editProfil, setEditProfil, onUpdateProfil }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Mon Profil
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Gérez vos informations personnelles et vos préférences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaUser className="text-4xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">
                    {profil?.prenom} {profil?.nom}
                  </h2>
                  <p className="text-purple-100 text-lg">{profil?.email}</p>
                  <div className="flex items-center mt-2">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{profil?.note || 5}/5</span>
                    <span className="mx-2">•</span>
                    <span>{profil?.trajetsEffectues || 0} trajets</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditProfil(!editProfil)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg transition-all flex items-center space-x-2"
              >
                <FaEdit />
                <span>{editProfil ? "Annuler" : "Modifier"}</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            {editProfil ? (
              <EditProfilForm profil={profil} onSave={onUpdateProfil} />
            ) : (
              <ViewProfilInfo profil={profil} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewProfilInfo = ({ profil }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Informations personnelles
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <p className="mt-1 text-gray-900">{profil?.prenom || "Non renseigné"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <p className="mt-1 text-gray-900">{profil?.nom || "Non renseigné"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-gray-900">{profil?.email || "Non renseigné"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
          <p className="mt-1 text-gray-900">{profil?.telephone || "Non renseigné"}</p>
        </div>
      </div>
    </div>
    
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Informations académiques
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Université</label>
          <p className="mt-1 text-gray-900">{profil?.universite || "Non renseigné"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Niveau d'études</label>
          <p className="mt-1 text-gray-900">{profil?.niveau || "Non renseigné"}</p>
        </div>
      </div>
    </div>
  </div>
);

const EditProfilForm = ({ profil, onSave }) => {
  const [formData, setFormData] = React.useState({
    prenom: profil?.prenom || "",
    nom: profil?.nom || "",
    telephone: profil?.telephone || "",
    universite: profil?.universite || "",
    niveau: profil?.niveau || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom
          </label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Université
          </label>
          <input
            type="text"
            name="universite"
            value={formData.universite}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau d'études
          </label>
          <select
            name="niveau"
            value={formData.niveau}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Sélectionner un niveau</option>
            <option value="Licence 1">Licence 1</option>
            <option value="Licence 2">Licence 2</option>
            <option value="Licence 3">Licence 3</option>
            <option value="Master 1">Master 1</option>
            <option value="Master 2">Master 2</option>
            <option value="Doctorat">Doctorat</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <FaSave />
          <span>Sauvegarder</span>
        </button>
      </div>
    </form>
  );
};

export default MonProfil;
