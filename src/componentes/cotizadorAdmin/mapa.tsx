import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import type { RouteData } from '../../interfaces/datosViaje';

const createLocationIcon = (variant: 'origin' | 'destination') => L.divIcon({
  className: `map-location-icon map-location-icon--${variant}`,
  html: '<span></span>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -20],
});

const originIcon = createLocationIcon('origin');
const destinationIcon = createLocationIcon('destination');

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

interface Props {
  data: RouteData
  cantidadRutas: number,
  noRuta: number,
  siguienteRuta: () => void,
  anteriorRuta: () => void,
}

export const MapaRuta = ({ data, cantidadRutas, noRuta, siguienteRuta, anteriorRuta}: Props) => {
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
    <div className="mx-auto my-10 w-[min(100%-2rem,42rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-xl shadow-slate-200/70">
      {
        cantidadRutas > 1 &&
        <div className="border-b border-slate-200 bg-slate-900 px-5 py-5 text-white sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Opciones de ruta</p>
                <p className="text-sm font-semibold text-white">Elige el recorrido para tu cotización</p>
                <p className="mt-1 text-xs text-slate-400">Compara las alternativas disponibles para tu destino.</p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="min-w-20 text-center text-sm font-semibold text-amber-300" aria-live="polite">
                  Ruta {noRuta + 1} <span className="font-normal text-slate-400">de {cantidadRutas}</span>
                </span>
                <button
                  type="button"
                  aria-label="Ver ruta anterior"
                  disabled={noRuta === 0}
                  onClick={anteriorRuta}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-800 text-lg font-semibold text-white shadow-sm transition hover:border-teal-400 hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span aria-hidden="true">&larr;</span>
                </button>
                <button
                  type="button"
                  aria-label="Ver ruta siguiente"
                  disabled={noRuta === cantidadRutas - 1}
                  onClick={siguienteRuta}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-lg font-semibold text-white shadow-sm transition hover:bg-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
        </div>
      }
      
      <MapContainer
        center={partidaLatLng}
        zoom={8}
        className="h-[420px] w-full sm:h-[500px]"
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
        <Marker position={partidaLatLng} icon={originIcon}>
          <Popup>
            <div className="map-popup">
              <span className="map-popup__eyebrow">Origen</span>
              <strong>Punto de partida</strong>
            </div>
          </Popup>
        </Marker>

        {/* Marcador Destino */}
        <Marker position={destinoLatLng} icon={destinationIcon}>
          <Popup>
            <div className="map-popup">
              <span className="map-popup__eyebrow">Destino</span>
              <strong>Fin del recorrido</strong>
              <div className="map-popup__stats">
                <span><small>Distancia</small>{data.distanciaKilometros.toFixed(1)} km</span>
                <span><small>Tiempo estimado</small>{Math.round(data.tiempoEstimado * 60)} min</span>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};