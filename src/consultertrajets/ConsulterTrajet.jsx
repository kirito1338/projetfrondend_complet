import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { MessageCircle } from "lucide-react";

import Navbar from "../componants/navbar";
import Footer from "../componants/Footer";
import MessageBox from "../componants/MessageBox";

import BackgroundEffects from "./components/BackgroundEffects";
import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import MapDialog from "./components/MapDialog";
import TripDetails from "./components/TripDetails";

import TripList from "./pages/TripList";

import useTripData from "./hooks/useTripData";

const ConsulterTrajet = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [messageBoxData, setMessageBoxData] = useState(null);
  const [showApropos, setShowApropos] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const autocompleteRef = useRef(null);
  const navigate = useNavigate();

  const {
    trajets,
    filteredTrajets,
    selectedTrajet,
    setSelectedTrajet,
    directions,
    addressDepart,
    setAddressDepart,
    isSearching,
    hasSearched,
    user,
    filterTrajetsByDepart,
    calculateRoute,
    handleReservation
  } = useTripData();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleTrajetSelection = (event) => {
    const selectedIndex = event.target.value;
    const displayTrajets = hasSearched ? filteredTrajets : trajets;

    if (selectedIndex === "" || !displayTrajets[selectedIndex]) {
      setSelectedTrajet(null);
      return;
    }

    const trajet = displayTrajets[selectedIndex];
    setSelectedTrajet(trajet);
    calculateRoute(trajet);
  };

  const onAutocompleteLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onAutocompletePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setAddressDepart(place.formatted_address);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Navbar
        user={user}
        handleLogout={handleLogout}
        setShowLogin={setShowLogin}
        setShowApropos={setShowApropos}
        setShowContact={setShowContact}
        showApropos={showApropos}
        showContact={showContact}
      />

      <div className="min-h-screen relative overflow-hidden">
        <BackgroundEffects />
        
        <Header />

        <div className="container mx-auto px-6 py-12 relative z-10">
          <SearchSection
            addressDepart={addressDepart}
            setAddressDepart={setAddressDepart}
            onAutocompleteLoad={onAutocompleteLoad}
            onAutocompletePlaceChanged={onAutocompletePlaceChanged}
            filterTrajetsByDepart={filterTrajetsByDepart}
            isSearching={isSearching}
          />

          <TripList
            trajets={trajets}
            filteredTrajets={filteredTrajets}
            hasSearched={hasSearched}
            handleTrajetSelection={handleTrajetSelection}
            selectedTrajet={selectedTrajet}
            setSelectedTrajet={setSelectedTrajet}
            calculateRoute={calculateRoute}
          />

          <TripDetails
            selectedTrajet={selectedTrajet}
            handleDialogOpen={handleDialogOpen}
            setMessageBoxData={setMessageBoxData}
            handleReservation={handleReservation}
          />

          <MapDialog
            dialogOpen={dialogOpen}
            handleDialogClose={handleDialogClose}
            selectedTrajet={selectedTrajet}
            directions={directions}
          />

          {selectedTrajet && (
            <div
              className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transform transition-all duration-300 flex items-center justify-center cursor-pointer"
              onClick={() => setMessageBoxData({ idExpediteur: selectedTrajet.idConducteur })}
            >
              <MessageCircle className="w-6 h-6" />
            </div>
          )}

          {messageBoxData && (
            <MessageBox
              message={messageBoxData}
              onClose={() => setMessageBoxData(null)}
            />
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ConsulterTrajet;
