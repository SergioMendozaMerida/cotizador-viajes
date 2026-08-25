import { useEffect, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react"
import type { CoordenadasViaje, IngresoDatosViaje, Coordenada, RouteData, Costos } from "../../interfaces/datosViaje"

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
        kilimetros: 0,
        honorariosPiloto: 0,
        viaticosPiloto: 0
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

    const [viajeRedondo, setViajeRedndo] = useState(false)
    const [noRuta, setNoRuta] = useState(0)
    const [cantidadDeRutas, setCantidadDeRutas] =useState(0)

    const cambiarRutaSiguiente = () => {
        if (noRuta < cantidadDeRutas - 1) {
            const nuevaRuta = noRuta + 1;
            setNoRuta(nuevaRuta);
            obtenerDatosMapra(nuevaRuta); // Le pasas la nueva ruta directamente
        }
    }
    const cambiarRutaAnterior = () => {
    if (noRuta > 0) {
            const nuevaRuta = noRuta - 1;
            setNoRuta(nuevaRuta);
            obtenerDatosMapra(nuevaRuta); // Le pasas la nueva ruta directamente
        }
    }

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
            const respuesta = await fetch(`https://router.project-osrm.org/route/v1/driving/${partida.longitud},${partida.latitud};${destino.longitud},${destino.latitud}?overview=full&geometries=geojson&alternatives=true`)
            const ruta = await respuesta.json()

            if(!respuesta.ok){
                throw new Error('Error al obtener la ruta '+ respuesta.status)
            }
            console.log(ruta)
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
            [name]: name === "dias" || name === "pasajeros" || name === "honorariosPiloto" || name === "viaticosPiloto" ? Number(value) : value
        }))
    }

    const obtenerDatosMapra = async (nuevaRuta: number) => {

        const coordenadasPartida: Coordenada = await obtenerCoordenadas(datosViaje.partida)
        const coordenadasDestino: Coordenada = await obtenerCoordenadas(datosViaje.destino)

        const ruta = await obtenerRuta(coordenadasPartida, coordenadasDestino)

        setCantidadDeRutas(await ruta.routes.length)

        let distancia = ruta.routes[nuevaRuta].distance

        if (viajeRedondo) {
            distancia = ruta.routes[nuevaRuta].distance * 2 
        }

        const tiempo = ruta.routes[nuevaRuta].duration
        const geometry = ruta.routes[nuevaRuta].geometry
        console.log(ruta)

        setDatosMaping({
            coordenadasPartida: {longitud: coordenadasPartida.longitud, latitud: coordenadasPartida.latitud},
            coordenadasDestino: {longitud: coordenadasDestino.longitud, latitud: coordenadasDestino.latitud},
            tiempoEstimado: tiempo/60/60,
            distanciaKilometros: distancia/1000,
            rutaGeometry: geometry
        })

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
            salarioChofer: datosViaje.honorariosPiloto,
            viaticosChofer: datosViaje.viaticosPiloto,
            reservaRiesgo: gastosFijos.reservaPorRiesgoDia * datosViaje.dias
        })
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setNoRuta(0)
        obtenerDatosMapra(0)
    }

    const handleCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setViajeRedndo(e.target.checked)
    }

    return(
        <>
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

            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="honorariosPiloto">
                    Honorarios del piloto
                </label>
                <input
                    id="honorariosPiloto"
                    name="honorariosPiloto"
                    type="number"
                    min="0"
                    step="0.01"
                    value={datosViaje.honorariosPiloto}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="viaticosPiloto">
                    Viáticos del piloto
                </label>
                <input
                    id="viaticosPiloto"
                    name="viaticosPiloto"
                    type="number"
                    min="0"
                    step="0.01"
                    value={datosViaje.viaticosPiloto}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>
            <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700" htmlFor="viajeRedondo">
                <input
                    id="viajeRedondo"
                    type="checkbox"
                    checked={viajeRedondo}
                    onChange={handleCheckBoxChange}
                    className="h-5 w-5 cursor-pointer rounded border-slate-300 bg-slate-100 text-teal-600 focus:ring-2 focus:ring-teal-500"
                />
                    ¿Viaje ida y vuelta?
                </label>
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
            {
                cantidadDeRutas > 1 &&
                <div className="mt-5 flex flex-col gap-4 rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Hemos encontrado más de una ruta para tu destino.</p>
                        <p className="mt-1 text-xs text-slate-500">Selecciona la opción que prefieras para cotizar.</p>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="min-w-16 text-center text-sm font-semibold text-teal-800" aria-live="polite">
                            Ruta {noRuta + 1} de {cantidadDeRutas}
                        </span>
                        <button
                            type="button"
                            aria-label="Ver ruta anterior"
                            disabled={noRuta === 0}
                    onClick={cambiarRutaAnterior}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-200 bg-white text-lg font-semibold text-teal-700 shadow-sm transition hover:border-teal-400 hover:bg-teal-100 focus:outline-none focus:ring-4 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >{"<"}</button>
                        <button
                            type="button"
                            aria-label="Ver ruta siguiente"
                            disabled={noRuta === cantidadDeRutas - 1}
                    onClick={cambiarRutaSiguiente}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-lg font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >{">"}</button>
                    </div>
                </div>
            }
        </>
    )
}