
export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.substring(0, 5); 
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

export const formatPrice = (price) => {
  if (!price) return '0.00';
  return parseFloat(price).toFixed(2);
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; 
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};


export const isTripAvailable = (trip) => {
  if (!trip) return false;
  
  const tripDate = new Date(trip.dateDepart);
  const now = new Date();
  

  if (tripDate <= now) return false;
  

  if (trip.placesDisponibles <= 0) return false;
  
  return true;
};


export const filterTripsByDeparture = (trips, departureAddress) => {
  if (!departureAddress || !trips) return trips;
  
  return trips.filter(trip =>
    trip.lieuDepart.toLowerCase().includes(departureAddress.toLowerCase())
  );
};


export const sortTrips = (trips, sortBy = 'date') => {
  if (!trips || trips.length === 0) return trips;
  
  const sortedTrips = [...trips];
  
  switch (sortBy) {
    case 'date':
      return sortedTrips.sort((a, b) => new Date(a.dateDepart) - new Date(b.dateDepart));
    case 'price':
      return sortedTrips.sort((a, b) => parseFloat(a.prix) - parseFloat(b.prix));
    case 'time':
      return sortedTrips.sort((a, b) => a.heureDepart.localeCompare(b.heureDepart));
    default:
      return sortedTrips;
  }
};


export const getTripStatus = (trip) => {
  if (!trip) return 'unknown';
  
  const tripDateTime = new Date(`${trip.dateDepart}T${trip.heureDepart}`);
  const now = new Date();
  
  if (tripDateTime <= now) {
    return 'completed';
  } else if (trip.placesDisponibles <= 0) {
    return 'full';
  } else {
    return 'available';
  }
};


export const generateTripSummary = (trip) => {
  if (!trip) return '';
  
  return `${trip.lieuDepart} → ${trip.lieuArrivee} le ${formatDate(trip.dateDepart)} à ${formatTime(trip.heureDepart)} - ${formatPrice(trip.prix)}€`;
};
