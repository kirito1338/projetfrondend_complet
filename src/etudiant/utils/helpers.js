
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.substring(0, 5); 
};

export const formatPrice = (price) => {
  if (!price) return '0.00';
  return parseFloat(price).toFixed(2);
};

export const calculateTripDuration = (departureTime, distance) => {
  if (!distance) return "Durée inconnue";
  const hours = Math.floor(distance / 60);
  const minutes = Math.round((distance / 60 - hours) * 60);
  
  if (hours === 0) {
    return `${minutes} min`;
  }
  return `${hours}h ${minutes > 0 ? minutes + 'min' : ''}`;
};

export const filterTrips = (trips, searchParams) => {
  let filtered = [...trips];

  if (searchParams.depart) {
    filtered = filtered.filter(trip =>
      trip.pointDepart?.toLowerCase().includes(searchParams.depart.toLowerCase())
    );
  }

  if (searchParams.arrivee) {
    filtered = filtered.filter(trip =>
      trip.pointArrivee?.toLowerCase().includes(searchParams.arrivee.toLowerCase())
    );
  }

  if (searchParams.date) {
    filtered = filtered.filter(trip => trip.date === searchParams.date);
  }

  if (searchParams.passagers) {
    filtered = filtered.filter(trip => 
      trip.placesDisponibles >= parseInt(searchParams.passagers)
    );
  }

  return filtered;
};

export const sortTrips = (trips, sortBy = 'date') => {
  const sortedTrips = [...trips];

  switch (sortBy) {
    case 'date':
      return sortedTrips.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'price':
      return sortedTrips.sort((a, b) => parseFloat(a.prix || 0) - parseFloat(b.prix || 0));
    case 'time':
      return sortedTrips.sort((a, b) => a.heureDepart.localeCompare(b.heureDepart));
    case 'places':
      return sortedTrips.sort((a, b) => b.placesDisponibles - a.placesDisponibles);
    default:
      return sortedTrips;
  }
};

export const isTripBookable = (trip) => {
  if (!trip) return false;
  
  const tripDate = new Date(trip.date);
  const now = new Date();
  
  if (tripDate <= now) return false;
  
  if (trip.placesDisponibles <= 0) return false;
  
  return true;
};

export const getTripStatus = (trip) => {
  if (!trip) return 'unknown';
  
  const tripDate = new Date(trip.date);
  const now = new Date();
  
  if (tripDate <= now) {
    return 'completed';
  } else if (trip.placesDisponibles <= 0) {
    return 'full';
  } else {
    return 'available';
  }
};

export const validateSearchParams = (searchParams) => {
  const errors = [];
  
  if (searchParams.date) {
    const selectedDate = new Date(searchParams.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.push("La date doit être dans le futur");
    }
  }
  
  if (searchParams.passagers && (searchParams.passagers < 1 || searchParams.passagers > 4)) {
    errors.push("Le nombre de passagers doit être entre 1 et 4");
  }
  
  return errors;
};

export const generateSearchSummary = (searchParams, resultsCount) => {
  const parts = [];
  
  if (searchParams.depart) parts.push(`de ${searchParams.depart}`);
  if (searchParams.arrivee) parts.push(`vers ${searchParams.arrivee}`);
  if (searchParams.date) parts.push(`le ${formatDate(searchParams.date)}`);
  if (searchParams.passagers > 1) parts.push(`pour ${searchParams.passagers} passagers`);
  
  const searchText = parts.length > 0 ? ` ${parts.join(' ')}` : '';
  return `${resultsCount} trajet${resultsCount > 1 ? 's' : ''} trouvé${resultsCount > 1 ? 's' : ''}${searchText}`;
};

export const calculateCostPerPerson = (totalPrice, passengers = 1) => {
  if (!totalPrice || passengers <= 0) return 0;
  return (parseFloat(totalPrice) / passengers).toFixed(2);
};

export const canFavoriteTrip = (trip, favoritesList) => {
  return !favoritesList.some(fav => fav.idTrajet === trip.idTrajet);
};

export const getUserRatingDisplay = (rating) => {
  if (!rating) return "Nouveau";
  return `${rating}/5 ⭐`;
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{2})(?=\d)/g, '$1 ');
};
