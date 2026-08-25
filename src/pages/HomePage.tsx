import { useState } from "react"
import type { RouteData, Costos, Coordenada } from "../interfaces/datosViaje"
import { FormDatosViaje } from "../componentes/cotizadorAdmin/formDatosViaje"
import { MapaRuta } from "../componentes/cotizadorAdmin/mapa"
import { CardsCostoViaje } from "../componentes/cotizadorAdmin/cardCostoViaje"
import { useCotizadorViaje } from "../hooks/useCotizadorViaje"


export const HomePage = () => {

    const [costos, setCostos] = useState<Costos>({
        litrosCombustible: 0,
        combustible: 0,
        depreciacion: 0,
        salarioChofer: 0,
        viaticosChofer: 0,
        reservaRiesgo: 0,
    })

    const [viajeRedondo, setViajeRedndo] = useState(false)
    const [cantidadDeRutas, setCantidadDeRutas] =useState(0)

    const [noRuta, setNoRuta] = useState(0)

    const cambiarRutaSiguiente = () => {
        if (noRuta < cantidadDeRutas - 1) {
            const nuevaRuta = noRuta + 1;
            setNoRuta(nuevaRuta);
            obtenerDatosMapa(nuevaRuta); // Le pasas la nueva ruta directamente
        }
    }
    const cambiarRutaAnterior = () => {
    if (noRuta > 0) {
            const nuevaRuta = noRuta - 1;
            setNoRuta(nuevaRuta);
            obtenerDatosMapa(nuevaRuta); // Le pasas la nueva ruta directamente
        }
    }

    const {
        obtenerCoordenadas,
        obtenerRuta,
        datosViaje,
        setDatosViaje,
        gastosFijos,
        setDatosIngreso,
        datosIngreso
    } = useCotizadorViaje()

    const obtenerDatosMapa = async (nuevaRuta: number) => {

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

        setDatosIngreso(datosViaje)
        setDatosIngreso((prev) => ({
            ...prev,
            kilimetros: distancia/1000
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

    const [datosMaping, setDatosMaping] = useState<RouteData>({
        coordenadasPartida: {
            latitud: "15.6501683",
            longitud: "-91.7716989"
        },
        coordenadasDestino: {
            latitud: "14.8464612",
            longitud: "-91.5194208"
        },
        distanciaKilometros: 191.625,
        tiempoEstimado: 2.4932222222222222,
        rutaGeometry: {
            type: "LineString",
            coordinates: [
            [-91.7716989, 15.6501683],
            [-91.7500000, 15.4000000],
            [-91.6000000, 15.1000000],
            [-91.5194208, 14.8464612]
            ]
        }
    })

    return(
        <div className="flex flex-col md:flex-row gap-6 items-start w-full">
            <div className="w-full md:w-1/2">
                <FormDatosViaje 
                    obtenerDatosMapa={obtenerDatosMapa}
                    setViajeRedondo={setViajeRedndo}
                    viajeRedondo={viajeRedondo}
                    setNoRuta={setNoRuta}
                    datosViaje={datosViaje}
                    setDatosViaje={setDatosViaje}
                />
            </div>
            <div className="w-full md:w-1/2">
                <CardsCostoViaje datosViaje={datosIngreso} gastosFijos={gastosFijos} costos={costos}></CardsCostoViaje>
            </div>
            <div className="w-full md:w-1/2">
                <MapaRuta 
                    data={datosMaping}
                    cantidadRutas={cantidadDeRutas}
                    noRuta={noRuta}
                    siguienteRuta={cambiarRutaSiguiente}
                    anteriorRuta={cambiarRutaAnterior}
                />
            </div>
        </div>
    )
}