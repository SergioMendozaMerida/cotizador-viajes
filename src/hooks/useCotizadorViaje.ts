import { useEffect, useState } from "react"
import type { Coordenada, IngresoDatosViaje } from "../interfaces/datosViaje"
import { supabase } from "../lib/supabaseClient"


export const useCotizadorViaje = () => {

        const [gastosFijos, setGastosFijos] = useState({
            kmPorLitro: 7.3,
            depreciacionKm: 3,
            choferPorDia: 200,
            viaticosChoferDia: 100,
            reservaPorRiesgoDia: 50,
            precioCombustible: 11,
            utilidad: 0.20
        })

        const [datosViaje, setDatosViaje] = useState<IngresoDatosViaje>({
            partida: "",
            destino: "",
            dias: 1,
            cotizante: "",
            pasajeros: 1,
            kilimetros: 0,
            honorariosPiloto: 0,
            viaticosPiloto: 0,
            fondoDeReserva: 0
        })

        /*const [datosIngreso, setDatosIngreso] = useState<IngresoDatosViaje>({
            partida: "",
            destino: "",
            dias: 1,
            cotizante: "",
            pasajeros: 1,
            kilimetros: 0,
            honorariosPiloto: 0,
            viaticosPiloto: 0,
            fondoDeReserva: 0
        })*/

    //FUNCIÓN SOLO PARA OBTENER COORDENADAS DE ACUERDO AL NOMBRE DEL LUGAR.
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
                alert("Error al obtener la ruta")
                throw new Error('Error al obtener la ruta '+ respuesta.status)
            }
            console.log(ruta)
            return ruta
        }
        catch (err){
            console.error('Error al obtener la ruta: ', err)
        }
    } 

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
    },[datosViaje])

    return{
        datosViaje,
        setDatosViaje,
        obtenerCoordenadas,
        obtenerRuta,
        gastosFijos,
        setGastosFijos,
        //setDatosIngreso,
        //datosIngreso
    }
}