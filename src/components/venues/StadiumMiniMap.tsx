import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los íconos de Leaflet en React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export const StadiumMiniMap = ({ coords }: { coords: [number, number] }) => {
  function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, 13);
    return null;
  }

  return (
    <div className="h-48 w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800">
      <MapContainer center={coords} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <Marker position={coords} />
        <ChangeView center={coords} />
      </MapContainer>
    </div>
  );
};