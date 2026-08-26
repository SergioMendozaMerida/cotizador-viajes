import { type ChangeEvent, type Dispatch, type SetStateAction } from "react"
import type { IngresoDatosViaje } from "../../interfaces/datosViaje"

interface Props{
    obtenerDatosMapa: (nuevaRuta: number) => void
    setViajeRedondo: Dispatch<SetStateAction<boolean>>
    setNoRuta: Dispatch<SetStateAction<number>>
    viajeRedondo: boolean
    datosViaje: IngresoDatosViaje
    setDatosViaje: Dispatch<SetStateAction<IngresoDatosViaje>>
}

export const FormDatosViaje = ({obtenerDatosMapa, setViajeRedondo, viajeRedondo, setNoRuta,
    datosViaje, setDatosViaje
}: Props) => {

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        if (name === "honorariosPiloto" || name === "viaticosPiloto" || name === "dias" || name === "pasajeros") {
            setDatosViaje((datosAnteriores) => ({
            ...datosAnteriores,
            [name]: parseFloat(value)
            }))
            return
        }

        setDatosViaje((datosAnteriores) => ({
            ...datosAnteriores,
            [name]: value
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setNoRuta(0)
        obtenerDatosMapa(0)
    }

    const handleCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setViajeRedondo(e.target.checked)
    }

    return(
        <>
        <form
            onSubmit={handleSubmit}
            className="mx-auto my-4 w-[min(100%-2rem,42rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-xl shadow-slate-200/70"
        >
            <div className="border-b border-slate-200 bg-slate-900 px-6 py-5 text-white sm:px-8">
                <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
                    Cotizador de viajes
                </p>
                <h1 className="m-0 text-3xl font-bold tracking-tight text-amber-300 sm:text-4xl">
                    Planea tu próxima aventura
                </h1>
                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">
                    Completa los datos del viaje y prepara una cotización a tu medida.
                </p>
            </div>

            <div className="grid gap-3 px-6 py-4 sm:grid-cols-2 sm:px-8">
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="partida">
                        Lugar de partida
                    </label>
                <input
                    id="partida"
                    name="partida"
                    type="text"
                    value={datosViaje.partida}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="destino">
                    Destino
                </label>
                <input
                    id="destino"
                    name="destino"
                    type="text"
                    value={datosViaje.destino}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="dias">
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
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="cotizante">
                    Nombre del cotizante
                </label>
                <input
                    id="cotizante"
                    name="cotizante"
                    type="text"
                    value={datosViaje.cotizante}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="pasajeros">
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
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="honorariosPiloto">
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
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700" htmlFor="viaticosPiloto">
                    Viáticos del piloto
                </label>
                <input
                    id="viaticosPiloto"
                    name="viaticosPiloto"
                    type="number"
                    min="0"
                    step="1"
                    value={datosViaje.viaticosPiloto}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
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
                    className="w-full rounded-lg bg-teal-600 px-5 py-2 font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/30 active:translate-y-px sm:w-auto"
                >
                    Cotizar viaje
                </button>
            </div>
            </div>
        </form>
        </>
    )
}