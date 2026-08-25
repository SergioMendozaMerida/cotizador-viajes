import { useEffect, useState } from "react"
import { type RouteData, type IngresoDatosViaje, type Costos } from "../interfaces/datosViaje"
import { FormDatosViaje } from "../componentes/cotizadorAdmin/formDatosViaje"
import { MapaRuta } from "../componentes/cotizadorAdmin/mapa"
import { CardsCostoViaje } from "../componentes/cotizadorAdmin/cardCostoViaje"
import { supabase } from "../lib/supabaseClient"

/*const gastosFijos = {
    kmPorLitro: 7.3,
    depreciacionKm: 3,
    choferPorDia: 200,
    viaticosChoferDia: 100,
    reservaPorRiesgoDia: 50,
    precioCombustible: 11,
    utilidad: 0.20
}*/

export const HomePage = () => {
    const [gastosFijos, setGastosFijos] = useState({
    kmPorLitro: 7.3,
    depreciacionKm: 3,
    choferPorDia: 200,
    viaticosChoferDia: 100,
    reservaPorRiesgoDia: 50,
    precioCombustible: 11,
    utilidad: 0.20
})

    const [datosIngreso, setDatosIngreso] = useState<IngresoDatosViaje>({
        partida: "",
        destino: "",
        dias: 1,
        cotizante: "",
        pasajeros: 1,
        kilimetros: 0,
        honorariosPiloto: 0,
        viaticosPiloto: 0
    })

    const [costos, setCostos] = useState<Costos>({
        litrosCombustible: 0,
        combustible: 0,
        depreciacion: 0,
        salarioChofer: 0,
        viaticosChofer: 0,
        reservaRiesgo: 0,
    })

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

    useEffect(() => {
        const fetchGastos = async () => {
        const { data, error } = await supabase
            .from('gastosFijos') // Nombre de tu tabla en Supabase
            .select('*')
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Error cargando gastos:', error.message);
        } else if (data) {
            setGastosFijos(await data);
        }
        };

        fetchGastos();
    },[datosIngreso])

    return(
        <div className="flex flex-col md:flex-row gap-6 items-start w-full">
            <div className="w-full md:w-1/2">
                <FormDatosViaje setDatos={setDatosIngreso} setDatosMaping={setDatosMaping} setCostos={setCostos} gastosFijos={gastosFijos} />
            </div>
            <div className="w-full md:w-1/2">
                <CardsCostoViaje datosViaje={datosIngreso} gastosFijos={gastosFijos} costos={costos}></CardsCostoViaje>
            </div>
            <div className="w-full md:w-1/2">
                <MapaRuta data={datosMaping} />
            </div>
        </div>
    )
}