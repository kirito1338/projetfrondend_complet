import React from "react";

const StudentForm = ({ formData, handleRegisterChange, role }) => {
  return (
    <>
      <input 
        name="prenom"
        className="w-full mb-4 p-2 border rounded" 
        placeholder="Prénom" 
        value={formData.prenom}
        onChange={handleRegisterChange}
        required
      />
      <input 
        name="nom"
        className="w-full mb-4 p-2 border rounded" 
        placeholder="Nom" 
        value={formData.nom}
        onChange={handleRegisterChange}
        required
      />
      <input 
        name="numero_etudiant"
        className="w-full mb-4 p-2 border rounded" 
        placeholder="Numéro étudiant" 
        value={formData.numero_etudiant}
        onChange={handleRegisterChange}
        required={role === "student"}
      />
      <input 
        name="telephone"
        className="w-full mb-4 p-2 border rounded" 
        placeholder="Téléphone" 
        value={formData.telephone}
        onChange={handleRegisterChange}
        required
      />
      <input 
        name="email"
        type="email"
        className="w-full mb-4 p-2 border rounded" 
        placeholder="Adresse Email" 
        value={formData.email}
        onChange={handleRegisterChange}
        required
      />
      <input 
        name="mot_de_passe"
        type="password"
        className="w-full mb-4 p-2 border rounded" 
        placeholder="Mot de passe" 
        value={formData.mot_de_passe}
        onChange={handleRegisterChange}
        required
      />
    </>
  );
};

export default StudentForm;
