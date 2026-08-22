export interface IngresoDatosViaje {
    partida: string,
    destino: string,
    dias: number,
    cotizante: string,
    pasajeros: number,
    kilimetros: number
}

export interface Coordenada {
    latitud: string,
    longitud: string
}

export interface CoordenadasViaje {
    coordenadasPartida: Coordenada,
    coordenadasDestino: Coordenada,
    nombrePartida: string,
    nombreDestino: string,
    tiempoEstimado: number,
    distanciaKilometros: number,
    rutaGeometry: any
}

// Interfaz para definir el objeto que te devuelve OSRM
export interface RouteData {
  coordenadasPartida: { latitud: string; longitud: string };
  coordenadasDestino: { latitud: string; longitud: string };
  distanciaKilometros: number;
  tiempoEstimado: number;
  rutaGeometry: {
    type: 'LineString';
    coordinates: [number, number][]; // [longitud, latitud]
  };
}

export interface Costos {
    litrosCombustible: number
    combustible: number,
    depreciacion: number,
    salarioChofer: number,
    viaticosChofer: number,
    reservaRiesgo: number,
};

export interface GastosFijos {
    kmPorLitro: number,
    depreciacionKm: number,
    choferPorDia: number,
    viaticosChoferDia: number,
    reservaPorRiesgoDia: number,
    precioCombustible: number,
    utilidad: number
}