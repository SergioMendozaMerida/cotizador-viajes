import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Corrección para los íconos predeterminados de Leaflet en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import type { RouteData } from '../../interfaces/datosViaje';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Componente para reencuadrar el mapa automáticamente según la ruta
const AutoFitBounds = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
  const map = useMap();
  React.useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  return null;
};

export const MapaRuta: React.FC<{ data: RouteData }> = ({ data }) => {
  // 1. Convertir GeoJSON [lon, lat] -> Leaflet [lat, lon]
  const polylineLatLngs: [number, number][] = data.rutaGeometry.coordinates.map(
    ([lon, lat]) => [lat, lon]
  );

  const partidaLatLng: [number, number] = [
    parseFloat(data.coordenadasPartida.latitud),
    parseFloat(data.coordenadasPartida.longitud)
  ];

  const destinoLatLng: [number, number] = [
    parseFloat(data.coordenadasDestino.latitud),
    parseFloat(data.coordenadasDestino.longitud)
  ];

  const bounds = L.latLngBounds([partidaLatLng, destinoLatLng]);

  return (
    <div className="mx-auto my-10 w-[min(100%-2rem,42rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-xl shadow-slate-200/70 h-[500px]">
      <MapContainer
        center={partidaLatLng}
        zoom={8}
        className="h-full w-full"
      >
        {/* Capa de mosaicos de OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ajuste automático de encuadre */}
        <AutoFitBounds bounds={bounds} />

        {/* Trazo de la ruta */}
        <Polyline positions={polylineLatLngs} color="#2563eb" weight={5} opacity={0.8} />

        {/* Marcador Origen */}
        <Marker position={partidaLatLng}>
          <Popup>Punto de Partida</Popup>
        </Marker>

        {/* Marcador Destino */}
        <Marker position={destinoLatLng}>
          <Popup>
            <div>
              <strong>Destino</strong><br />
              Distancia: {data.distanciaKilometros.toFixed(1)} km<br />
              Tiempo: {Math.round(data.tiempoEstimado * 60)} min
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};