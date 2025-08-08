import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Parametres.css";

export default function Parametres() {
  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: ""
  });

  const [vehicles, setVehicles] = useState([]);
  const [vehicleForm, setVehicleForm] = useState({
    marque: "",
    modele: "",
    annee: "",
    couleur: "",
    numeroPlaque: "",
    nombrePlaces: 4,
    typeCarburant: "essence",
    description: ""
  });

  useEffect(() => {
    fetchUserData();
    fetchVehicles();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (user) {
        setProfileData({
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.email || "",
          phone: user.num_de_tele || "",
          bio: user.bio || ""
        });
      }
    } catch (error) {
      console.error("Erreur récupération profil:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/vehicules/mes-vehicules", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data);
    } catch (error) {
      console.error("Erreur récupération véhicules:", error);
      setVehicles([]); 
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      const formData = new FormData();
      formData.append('firstName', profileData.firstName);
      formData.append('lastName', profileData.lastName);
      formData.append('email', profileData.email);
      formData.append('numDeTele', profileData.phone);

      const response = await axios.put("http://localhost:8000/api/users/me", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = { 
        ...user, 
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        num_de_tele: profileData.phone,
        bio: profileData.bio
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setSuccessMessage(" Profil mis à jour avec succes !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      setSuccessMessage(" Erreur lors de la mise à jour du profil");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!vehicleForm.marque || !vehicleForm.modele || !vehicleForm.annee || 
          !vehicleForm.couleur || !vehicleForm.numeroPlaque) {
        setSuccessMessage("Veuillez remplir tous les champs obligatoires");
        setTimeout(() => setSuccessMessage(""), 3000);
        setLoading(false);
        return;
      }

      const annee = parseInt(vehicleForm.annee);
      const nombrePlaces = parseInt(vehicleForm.nombrePlaces);

      if (isNaN(annee) || annee < 1900 || annee > new Date().getFullYear() + 1) {
        setSuccessMessage(" Veuillez entrer une année valide");
        setTimeout(() => setSuccessMessage(""), 3000);
        setLoading(false);
        return;
      }

      if (isNaN(nombrePlaces) || nombrePlaces < 1 || nombrePlaces > 9) {
        setSuccessMessage(" Le nombre de places doit être entre 1 et 9");
        setTimeout(() => setSuccessMessage(""), 3000);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      
      const vehicleData = {
        marque: vehicleForm.marque.trim(),
        modele: vehicleForm.modele.trim(),
        annee: annee,
        couleur: vehicleForm.couleur.trim(),
        numeroPlaque: vehicleForm.numeroPlaque.trim(),
        nombrePlaces: nombrePlaces,
        typeCarburant: vehicleForm.typeCarburant,
        description: vehicleForm.description?.trim() || null
      };

      
      if (editingVehicle) {
        await axios.put(`http://localhost:8000/api/vehicules/${editingVehicle.id_vehicule}`, vehicleData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setSuccessMessage("✅ Véhicule modifié avec succès !");
      } else {
        await axios.post("http://localhost:8000/api/vehicules", vehicleData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setSuccessMessage("✅ Véhicule ajouté avec succès !");
      }

      setVehicleForm({
        marque: "",
        modele: "",
        annee: new Date().getFullYear(),
        couleur: "",
        numeroPlaque: "",
        nombrePlaces: 4,
        typeCarburant: "essence",
        description: ""
      });
      setShowVehicleModal(false);
      setEditingVehicle(null);
      fetchVehicles();
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erreur véhicule:", error);
      console.error("Détails de l'erreur:", error.response?.data); 
      
      if (error.response?.data?.detail) {
        setSuccessMessage(`❌ ${error.response.data.detail}`);
      } else {
        setSuccessMessage("❌ Erreur lors de l'enregistrement du véhicule");
      }
      setTimeout(() => setSuccessMessage(""), 5000); 
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/vehicules/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMessage("Véhicule supprimé avec succès !");
      fetchVehicles();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erreur suppression véhicule:", error);
      setSuccessMessage(" Erreur lors de la suppression du véhicule");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const openEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleForm({
      marque: vehicle.marque || "",
      modele: vehicle.modele || "",
      annee: vehicle.annee || "",
      couleur: vehicle.couleur || "",
      numeroPlaque: vehicle.numeroPlaque || "",
      nombrePlaces: vehicle.nombrePlaces || 4,
      typeCarburant: vehicle.typeCarburant || "essence",
      description: vehicle.description || ""
    });
    setShowVehicleModal(true);
  };

  const openNewVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm({
      marque: "",
      modele: "",
      annee: new Date().getFullYear(),
      couleur: "",
      numeroPlaque: "",
      nombrePlaces: 4,
      typeCarburant: "essence",
      description: ""
    });
    setShowVehicleModal(true);
  };

  return (
    <div className="parametres-container">
      <div className="parametres-header">
        <h2 className="parametres-title">
          ⚙️ Paramètres du Compte
        </h2>
        <div className="parametres-divider"></div>
        <p className="parametres-subtitle">Configurez votre profil conducteur</p>
      </div>

      {successMessage && (
        <div className="success-message">
          <span>{successMessage}</span>
        </div>
      )}

      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <span>👤</span>
          <span>Profil Personnel</span>
        </button>
        <button 
          className={`tab-button ${activeTab === "vehicles" ? "active" : ""}`}
          onClick={() => setActiveTab("vehicles")}
        >
          <span>🚗</span>
          <span>Mes Véhicules</span>
        </button>
      </div>

      <div className="content-section">
        {activeTab === "profile" && (
          <div className="profile-section">
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span>👤</span>
                    <span>Prénom</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    placeholder="Votre prénom"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>👤</span>
                    <span>Nom</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📧</span>
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="votre.email@exemple.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>📱</span>
                    <span>Téléphone</span>
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>📝</span>
                  <span>Biographie</span>
                </label>
                <textarea
                  className="form-input form-textarea"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Parlez-nous de vous..."
                  rows="4"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                <span>💾</span>
                <span>{loading ? "Enregistrement..." : "Enregistrer les modifications"}</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === "vehicles" && (
          <div className="vehicle-section">
            <div className="vehicle-header">
              <h3 className="vehicle-title">
                <span>🚗</span>
                <span>Mes Véhicules</span>
              </h3>
              <button 
                className="btn btn-primary"
                onClick={openNewVehicle}
              >
                <span>➕</span>
                <span>Ajouter un véhicule</span>
              </button>
            </div>

            <div className="vehicle-list">
              {vehicles.length === 0 ? (
                <div className="empty-vehicle">
                  <div className="empty-vehicle-icon">🚗</div>
                  <h4>Aucun véhicule enregistré</h4>
                  <p>Ajoutez votre premier véhicule pour commencer à proposer des trajets</p>
                </div>
              ) : (
                vehicles.map((vehicle, index) => (
                  <div key={vehicle.id_vehicule || index} className="vehicle-card">
                    <div className="vehicle-card-header">
                      <div className="vehicle-info">
                        <h4 className="vehicle-name">
                          {vehicle.marque} {vehicle.modele} ({vehicle.annee})
                        </h4>
                        <div className="vehicle-details">
                          <div>🎨 Couleur: {vehicle.couleur}</div>
                          <div>🔢 Plaque: {vehicle.numeroPlaque}</div>
                          <div>👥 Places: {vehicle.nombrePlaces}</div>
                          <div>⛽ Carburant: {vehicle.typeCarburant}</div>
                        </div>
                        {vehicle.description && (
                          <p style={{marginTop: "0.5rem", color: "rgba(255,255,255,0.8)"}}>
                            {vehicle.description}
                          </p>
                        )}
                      </div>
                      <div className="vehicle-actions">
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => openEditVehicle(vehicle)}
                        >
                          <span>✏️</span>
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteVehicle(vehicle.id_vehicule)}
                        >
                          <span>🗑️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {showVehicleModal && (
        <div className="modal-overlay" onClick={() => setShowVehicleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingVehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowVehicleModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVehicleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">
                  <span>🏭</span>
                  <span>Marque</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={vehicleForm.marque}
                  onChange={(e) => setVehicleForm({...vehicleForm, marque: e.target.value})}
                  placeholder="Ex: Toyota, Renault, BMW..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>🚗</span>
                  <span>Modèle</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={vehicleForm.modele}
                  onChange={(e) => setVehicleForm({...vehicleForm, modele: e.target.value})}
                  placeholder="Ex: Corolla, Clio, X3..."
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span>📅</span>
                    <span>Année</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={vehicleForm.annee}
                    onChange={(e) => setVehicleForm({...vehicleForm, annee: e.target.value})}
                    placeholder="2020"
                    min="1990"
                    max="2025"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>🎨</span>
                    <span>Couleur</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={vehicleForm.couleur}
                    onChange={(e) => setVehicleForm({...vehicleForm, couleur: e.target.value})}
                    placeholder="Blanc, Noir, Rouge..."
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <span>🔢</span>
                    <span>Numéro de plaque</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={vehicleForm.numeroPlaque}
                    onChange={(e) => setVehicleForm({...vehicleForm, numeroPlaque: e.target.value})}
                    placeholder="ABC-1234"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>👥</span>
                    <span>Nombre de places</span>
                  </label>
                  <select
                    className="form-input"
                    value={vehicleForm.nombrePlaces}
                    onChange={(e) => setVehicleForm({...vehicleForm, nombrePlaces: parseInt(e.target.value)})}
                  >
                    <option value={2}>2 places</option>
                    <option value={4}>4 places</option>
                    <option value={5}>5 places</option>
                    <option value={7}>7 places</option>
                    <option value={9}>9 places</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>⛽</span>
                  <span>Type de carburant</span>
                </label>
                <select
                  className="form-input"
                  value={vehicleForm.typeCarburant}
                  onChange={(e) => setVehicleForm({...vehicleForm, typeCarburant: e.target.value})}
                >
                  <option value="essence">Essence</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybride">Hybride</option>
                  <option value="electrique">Électrique</option>
                  <option value="gpl">GPL</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>📝</span>
                  <span>Description (optionnel)</span>
                </label>
                <textarea
                  className="form-input form-textarea"
                  value={vehicleForm.description}
                  onChange={(e) => setVehicleForm({...vehicleForm, description: e.target.value})}
                  placeholder="Informations supplémentaires sur votre véhicule..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowVehicleModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <span>💾</span>
                  <span>{loading ? "Enregistrement..." : "Enregistrer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
