import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

export default function MapDialog({ 
  dialogOpen, 
  handleDialogClose, 
  selectedTrajet, 
  directions 
}) {
  return (
    <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ 
        background: '#1e40af', 
        color: 'white',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '1.25rem'
      }}>
        Trip Route Visualization
      </DialogTitle>
      <DialogContent sx={{ padding: 0 }}>
        {window.google && (
          <GoogleMap 
            mapContainerStyle={{ height: "500px", width: "100%" }} 
            zoom={10}
            center={selectedTrajet ? {
              lat: parseFloat(selectedTrajet.latitude_depart),
              lng: parseFloat(selectedTrajet.longitude_depart),
            } : { lat: 33.5731, lng: -7.5898 }}
          >
            {selectedTrajet && (
              <>
                <Marker
                  position={{
                    lat: parseFloat(selectedTrajet.latitude_depart),
                    lng: parseFloat(selectedTrajet.longitude_depart),
                  }}
                  title={`Departure: ${selectedTrajet.pointDepart}`}
                />
                <Marker
                  position={{
                    lat: parseFloat(selectedTrajet.latitude_arrivee),
                    lng: parseFloat(selectedTrajet.longitude_arrivee),
                  }}
                  title={`Arrival: ${selectedTrajet.pointArrivee}`}
                />
              </>
            )}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        )}
      </DialogContent>
      <DialogActions sx={{ background: '#f8fafc', padding: 3 }}>
        <Button 
          onClick={handleDialogClose} 
          sx={{
            background: '#1e40af',
            color: 'white',
            '&:hover': {
              background: '#1d4ed8',
            },
            borderRadius: '8px',
            textTransform: 'none',
            paddingX: 3,
            paddingY: 1.5,
            fontWeight: 500,
          }}
        >
          Close Map
        </Button>
      </DialogActions>
    </Dialog>
  );
}
