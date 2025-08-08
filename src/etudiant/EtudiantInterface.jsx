import React from "react";


import Navigation from "./components/Navigation";

import RechercheTrajet from "./pages/RechercheTrajet";
import MesReservations from "./pages/MesReservations";
import MesFavoris from "./pages/MesFavoris";
import MonProfil from "./pages/MonProfil";

import useEtudiantData from "./hooks/useEtudiantData";

const EtudiantInterface = ({ user: userProp, onLogout }) => {
  const {
    // State
    selectedSection,
    setSelectedSection,
    trajets,
    reservations,
    favoris,
    profil,
    editProfil,
    setEditProfil,
    searchParams,
    setSearchParams,
    
    // Actions
    handleSearch,
    handleReserver,
    handleFavoris,
    handleUpdateProfil,
  } = useEtudiantData(userProp);

  const renderContent = () => {
    switch (selectedSection) {
      case "recherche":
        return (
          <RechercheTrajet
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            trajets={trajets}
            onSearch={handleSearch}
            onReserver={handleReserver}
            onFavoris={handleFavoris}
          />
        );
        
      case "reservations":
        return (
          <MesReservations reservations={reservations} />
        );
        
      case "favoris":
        return (
          <MesFavoris
            favoris={favoris}
            onReserver={handleReserver}
            onFavoris={handleFavoris}
          />
        );
        
      case "profil":
        return (
          <MonProfil
            profil={profil}
            editProfil={editProfil}
            setEditProfil={setEditProfil}
            onUpdateProfil={handleUpdateProfil}
          />
        );
        
      default:
        return (
          <RechercheTrajet
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            trajets={trajets}
            onSearch={handleSearch}
            onReserver={handleReserver}
            onFavoris={handleFavoris}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        onLogout={onLogout}
      />
      
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default EtudiantInterface;
