import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icônes manquantes dans Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function CarteTrajets() {
  const center = [45.5017, -73.5673]; // Centre Montréal
  const points = [
    { ville: "Montréal", coords: [45.5017, -73.5673] },
    { ville: "Laval", coords: [45.6066, -73.7124] },
    { ville: "Longueuil", coords: [45.5312, -73.5181] },
  ];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer center={center} zoom={10} className="h-full w-full z-10">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((pt, idx) => (
          <Marker position={pt.coords} key={idx}>
            <Popup>{pt.ville}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
