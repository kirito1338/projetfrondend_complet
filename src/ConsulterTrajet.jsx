import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material"; // For pop-up dialog

const GOOGLE_MAPS_API_KEY = "AIzaSyBo_o1KoYrdYgDbPkR2e0uwj5qrXUSeOwE"; // Replace with your actual API key

const ConsulterTrajet = () => {
  const [trajets, setTrajets] = useState([]);
  const [filteredTrajets, setFilteredTrajets] = useState([]);
  const [addressDepart, setAddressDepart] = useState("");
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [directions, setDirections] = useState(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // For opening the dialog
  const [message, setMessage] = useState(""); // For storing the message
  const [showChatBox, setShowChatBox] = useState(false); // For showing the message box
  const autocompleteRef = useRef(null);

  // Fetch all trips from the API
  useEffect(() => {
    fetch("http://localhost:8000/rides/all")
      .then((response) => response.json())
      .then((data) => setTrajets(data))
      .catch((error) => console.error("Error fetching trips:", error));
  }, []);

  // Get coordinates of a given address
  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const location = response.data.results[0]?.geometry.location;
      if (location) return location;
      else throw new Error("Address not found");
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  // Filter trips by departure address
  const filterTrajetsByDepart = async () => {
    if (!addressDepart) {
      setFilteredTrajets([]); // Reset filtered trips if address is empty
      return;
    }

    const departCoordinates = await getCoordinates(addressDepart);
    if (!departCoordinates) {
      console.error("Unable to retrieve coordinates for departure address");
      return;
    }

    const filtered = trajets.filter((trajet) =>
      trajet.depart.toLowerCase().includes(addressDepart.toLowerCase())
    );

    setFilteredTrajets(filtered);
  };

  // Calculate the route between two locations
  const calculateRoute = async (trajet) => {
    if (!trajet || !trajet.depart || !trajet.arrivee) {
      console.error("Invalid trip");
      return;
    }

    const { depart, arrivee } = trajet;

    const departCoordinates = await getCoordinates(depart);
    const arriveeCoordinates = await getCoordinates(arrivee);

    if (!departCoordinates || !arriveeCoordinates) {
      console.error("Unable to retrieve coordinates for addresses");
      return;
    }

    if (!window.google || !window.google.maps) {
      console.error("Google Maps API is not loaded");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: departCoordinates,
        destination: arriveeCoordinates,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Error calculating route:", status);
        }
      }
    );
  };

  // Handle trip selection
  const handleTrajetSelection = (event) => {
    const selectedIndex = event.target.value;

    if (selectedIndex === "" || !filteredTrajets[selectedIndex]) {
      setSelectedTrajet(null);
      return;
    }

    const trajet = filteredTrajets[selectedIndex];
    setSelectedTrajet(trajet);
    calculateRoute(trajet); // Calculate route for the selected trip
  };

  const onAutocompleteLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onAutocompletePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setAddressDepart(place.formatted_address);
      filterTrajetsByDepart();
    }
  };

  const onLoad = () => {
    setGoogleMapsLoaded(true);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value); // Update the message as the user types
  };

  const handleSendMessage = async () => {
    if (!selectedTrajet) {
      alert("Please select a trip first");
      return;
    }
    const token = localStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté.");
    return;
  }
    console.log("Sending message to driver:", message); // 🔍 Ajout ici

    try {
      await axios.post(
        `http://localhost:8000/send_message_to_driver/${selectedTrajet.id}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(""); // Clear the input
      setShowChatBox(false); // Close the message box
      alert(`Message sent to the driver: ${message}`); // Simulate a message send confirmation
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleChatBox = () => {
    setShowChatBox(!showChatBox); // Toggle the visibility of the message box
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Trajets</h2>

      {/* Google Places Autocomplete for departure address */}
      <div>
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]} onLoad={onLoad}>
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onAutocompletePlaceChanged}
          >
            <input
              type="text"
              value={addressDepart}
              onChange={(e) => setAddressDepart(e.target.value)}
              placeholder="Enter your departure address"
              style={{ width: "100%", padding: "8px" }}
            />
          </Autocomplete>
        </LoadScript>
        <button onClick={filterTrajetsByDepart}>Search for trips</button>
      </div>

      {/* List of filtered trips */}
      {filteredTrajets.length > 0 && (
        <div>
          <h3>Trips passing through your departure address:</h3>
          <select onChange={handleTrajetSelection}>
            <option value="">Select a trip</option>
            {filteredTrajets.map((trajet, index) => (
              <option key={index} value={index}>
                {trajet.depart} {'->'} {trajet.arrivee}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedTrajet && (
        <div>
          <p><strong>Selected Trip:</strong> {selectedTrajet.depart} to {selectedTrajet.arrivee}</p>
          <p><strong>Date:</strong> {selectedTrajet.date}</p>
          <p><strong>Time:</strong> {selectedTrajet.heure}</p>
          <button onClick={handleDialogOpen}>View Map and Route</button>
        </div>
      )}

      {/* Dialog with map and route */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Trip Route</DialogTitle>
        <DialogContent>
          {googleMapsLoaded && (
            <GoogleMap mapContainerStyle={{ height: "400px", width: "100%" }} zoom={10}>
              {selectedTrajet && (
                <>
                  <Marker
                    position={{
                      lat: parseFloat(selectedTrajet.latitude_depart),
                      lng: parseFloat(selectedTrajet.longitude_depart),
                    }}
                    title={`Departure: ${selectedTrajet.depart}`}
                  />
                  <Marker
                    position={{
                      lat: parseFloat(selectedTrajet.latitude_arrivee),
                      lng: parseFloat(selectedTrajet.longitude_arrivee),
                    }}
                    title={`Arrival: ${selectedTrajet.arrivee}`}
                  />
                </>
              )}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Floating Message Button (only when a trip is selected) */}
      {selectedTrajet && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "50%",
            padding: "15px",
            cursor: "pointer",
          }}
          onClick={toggleChatBox}
        >
          💬
        </div>
      )}

      {/* Floating Chat Box */}
      {showChatBox && selectedTrajet && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            padding: "20px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4>Message to the Driver</h4>
          <TextField
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message..."
            multiline
            rows={4}
            fullWidth
            variant="outlined"
          />
          <Button onClick={handleSendMessage} color="primary">Send</Button>
        </div>
      )}
    </div>
  );
};

export default ConsulterTrajet;
