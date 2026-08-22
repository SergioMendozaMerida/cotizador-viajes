import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import type { CoordenadasViaje, IngresoDatosViaje, Coordenada, RouteData, Costos } from "../interfaces/datosViaje"

interface Porps{
    setDatos: Dispatch<SetStateAction<IngresoDatosViaje>>
    setDatosMaping: Dispatch<SetStateAction<RouteData>>
    setCostos: Dispatch<SetStateAction<Costos>>
    gastosFijos: any
}

export const FormDatosViaje = ({setDatos, setDatosMaping, setCostos, gastosFijos}: Porps) => {

    const [datosViaje, setDatosViaje] = useState<IngresoDatosViaje>({
        partida: "",
        destino: "",
        dias: 1,
        cotizante: "",
        pasajeros: 1,
        kilimetros: 0
    })
    const [coordenadasViaje, setCoordenadasViaje] = useState<CoordenadasViaje>({
        coordenadasPartida: {latitud: "", longitud: ""},
        coordenadasDestino: {latitud: "", longitud: ""},
        nombrePartida: "",
        nombreDestino: "",
        tiempoEstimado: 0,
        distanciaKilometros: 0,
        rutaGeometry: []
    })

    const obtenerCoordenadas = async (nombreUbicacion: string):Promise<Coordenada> => {
            try {
                const respuesta = await fetch(`https://nominatim.openstreetmap.org/search?q=${nombreUbicacion}&format=json&limit=1`, {
                    headers: {'User-Agent': 'CotizadorViajesExpres/1.0'}
                })

                const data = await respuesta.json()
                if (data.length === 0){
                    throw new Error(`No se encontró la ubicación: "${nombreUbicacion}"`)
                }

                const coordenada: Coordenada = {latitud: data[0].lat, longitud: data[0].lon}
                console.log(coordenada)

                return coordenada
            }
            catch (err) {
                console.error("Error al obtener coordenadas", err)
                return {latitud: "no encontrada", longitud: "no encontrada"}
            }
    }

    const obtenerRuta = async(partida: Coordenada, destino: Coordenada) => {
        try {
            const respuesta = await fetch(`https://router.project-osrm.org/route/v1/driving/${partida.longitud},${partida.latitud};${destino.longitud},${destino.latitud}?overview=full&geometries=geojson`)
            const ruta = await respuesta.json()

            if(!respuesta.ok){
                throw new Error('Error al obtener la ruta '+ respuesta.status)
            }

            return ruta
        }
        catch (err){
            console.error('Error al obtener la ruta: ', err)
        }
    } 

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setDatosViaje((datosAnteriores) => ({
            ...datosAnteriores,
            [name]: name === "dias" || name === "pasajeros" ? Number(value) : value
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const coordenadasPartida: Coordenada = await obtenerCoordenadas(datosViaje.partida)
        const coordenadasDestino: Coordenada = await obtenerCoordenadas(datosViaje.destino)

        const ruta = await obtenerRuta(coordenadasPartida, coordenadasDestino)

        const distancia = ruta.routes[0].distance
        const tiempo = ruta.routes[0].duration
        const geometry = ruta.routes[0].geometry
        console.log(ruta)

        setDatosMaping({
            coordenadasPartida: {longitud: coordenadasPartida.longitud, latitud: coordenadasPartida.latitud},
            coordenadasDestino: {longitud: coordenadasDestino.longitud, latitud: coordenadasDestino.latitud},
            tiempoEstimado: tiempo/60/60,
            distanciaKilometros: distancia/1000,
            rutaGeometry: geometry
        })

        setDatos((prev) => ({
            ...prev,
            kilimetros: distancia/1000
        }))

        setDatosViaje((prev) => ({
            ...prev,
            kilimetros: distancia/1000
        }))

        setDatos(datosViaje)
        setDatos((prev) => ({
            ...prev,
            kilimetros: distancia/1000
        }))

        setCoordenadasViaje((datosAnteriores) => ({
            ...datosAnteriores,
            nombrePartida: datosViaje.partida,
            nombreDestino: datosViaje.destino,
            coordenadasPartida: coordenadasPartida,
            coordenadasDestino: coordenadasDestino,
            distanciaKilometros: distancia/1000,
            tiempoEstimado: tiempo/60/60,
            rutaGeometry: geometry
        }))

        const litrosCombustible = (distancia/1000) / gastosFijos.kmPorLitro

        setCostos({
            litrosCombustible: (distancia/1000) / gastosFijos.kmPorLitro,
            combustible: litrosCombustible * gastosFijos.precioCombustible,
            depreciacion: (distancia/1000) * gastosFijos.depreciacionKm,
            salarioChofer: gastosFijos.choferPorDia * datosViaje.dias,
            viaticosChofer: gastosFijos.viaticosChoferDia * datosViaje.dias,
            reservaRiesgo: gastosFijos.reservaPorRiesgoDia * datosViaje.dias
        })
    }

    useEffect(() => {
        //console.log('Respuesta de coordenadas de viaje')
        console.log(coordenadasViaje)
    },[coordenadasViaje])

    return(
        <form
            onSubmit={handleSubmit}
            className="mx-auto my-10 w-[min(100%-2rem,42rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-xl shadow-slate-200/70"
        >
            <div className="border-b border-slate-200 bg-slate-900 px-6 py-7 text-white sm:px-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
                    Cotizador de viajes
                </p>
                <h1 className="m-0 text-3xl font-bold tracking-tight text-amber-300 sm:text-4xl">
                    Planea tu próxima aventura
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                    Completa los datos del viaje y prepara una cotización a tu medida.
                </p>
            </div>

            <div className="grid gap-5 px-6 py-7 sm:grid-cols-2 sm:px-8">
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="partida">
                        Lugar de partida
                    </label>
                <input
                    id="partida"
                    name="partida"
                    type="text"
                    value={datosViaje.partida}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="destino">
                    Destino
                </label>
                <input
                    id="destino"
                    name="destino"
                    type="text"
                    value={datosViaje.destino}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="dias">
                    Días de viaje
                </label>
                <input
                    id="dias"
                    name="dias"
                    type="number"
                    min="1"
                    value={datosViaje.dias}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="cotizante">
                    Nombre del cotizante
                </label>
                <input
                    id="cotizante"
                    name="cotizante"
                    type="text"
                    value={datosViaje.cotizante}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="pasajeros">
                    Cantidad de pasajeros
                </label>
                <input
                    id="pasajeros"
                    name="pasajeros"
                    type="number"
                    min="1"
                    value={datosViaje.pasajeros}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div className="sm:col-span-2 sm:flex sm:justify-end">
                <button
                    type="submit"
                    className="w-full rounded-lg bg-teal-600 px-5 py-3 font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/30 active:translate-y-px sm:w-auto"
                >
                    Cotizar viaje
                </button>
            </div>
            </div>
        </form>
    )
}