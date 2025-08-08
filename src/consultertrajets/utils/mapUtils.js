import axios from "axios";

export const GOOGLE_MAPS_API_KEY = "AIzaSyBo_o1KoYrdYgDbPkR2e0uwj5qrXUSeOwE";

export const getCoordinates = async (address) => {
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
