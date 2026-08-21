import type { IngresoDatosViaje } from "../interfaces/datosViaje"

const precioCombustible = 11

interface Props {
    datosViaje: IngresoDatosViaje
    gastosFijos: any
    costos: any
}

export const CardsCostoViaje = ({datosViaje, gastosFijos, costos}: Props) => {

    //const costoTotal = Object.values(costos).reduce((acc, curr) => acc + curr, 0);

    return (
        <div className="mx-auto my-10 w-[min(100%-2rem,42rem)] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-left shadow-xl shadow-slate-200/70">
        {/* Encabezado con datos generales del viaje */}
        <div className="border-b border-slate-200 bg-slate-900 px-6 py-6 text-white sm:px-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
            Resumen de la Cotización
            </p>
            <h2 className="m-0 text-2xl font-bold tracking-tight text-amber-300 sm:text-3xl">
            {datosViaje.partida} &rarr; {datosViaje.destino}
            </h2>
            
            <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-800/80 p-3 text-sm border border-slate-700/60">
            <div>
                <span className="block text-xs font-medium text-slate-400">Distancia</span>
                <span className="text-base font-semibold text-white">
                {datosViaje.kilimetros.toFixed(1)} km
                </span>
            </div>
            <div>
                <span className="block text-xs font-medium text-slate-400">Duración</span>
                <span className="text-base font-semibold text-white">
                {datosViaje.dias} {datosViaje.dias === 1 ? 'día' : 'días'}
                </span>
            </div>
            </div>
        </div>

        {/* Grid de Tarjetas de Costos */}
        <div className="p-6 sm:p-8">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            Desglose de Costos Estimados
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
            {/* Combustible */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300">
                <span className="block text-xs font-medium text-slate-500">Combustible</span>
                <span className="mt-1 block text-xl font-bold text-slate-800">
                Q{costos.combustible.toFixed(2)}
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                ~{costos.litrosCombustible.toFixed(1)} L (Q{precioCombustible}/L)
                </span>
            </div>

            {/* Depreciación del vehículo */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300">
                <span className="block text-xs font-medium text-slate-500">Depreciación Vehículo</span>
                <span className="mt-1 block text-xl font-bold text-slate-800">
                Q{costos.depreciacion.toFixed(2)}
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                Q{gastosFijos.depreciacionKm} x km recorrido
                </span>
            </div>

            {/* Honorarios Chofer */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300">
                <span className="block text-xs font-medium text-slate-500">Honorarios Chofer</span>
                <span className="mt-1 block text-xl font-bold text-slate-800">
                Q{costos.salarioChofer.toFixed(2)}
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                Q{gastosFijos.choferPorDia} / día
                </span>
            </div>

            {/* Viáticos Chofer */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300">
                <span className="block text-xs font-medium text-slate-500">Viáticos Chofer</span>
                <span className="mt-1 block text-xl font-bold text-slate-800">
                Q{costos.viaticosChofer.toFixed(2)}
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                Q{gastosFijos.viaticosChoferDia} / día
                </span>
            </div>

            {/* Fondo de Reserva */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 sm:col-span-2">
                <span className="block text-xs font-medium text-slate-500">Fondo de Reserva por Riesgo</span>
                <span className="mt-1 block text-xl font-bold text-slate-800">
                Q{costos.reservaRiesgo.toFixed(2)}
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                Q{gastosFijos.reservaPorRiesgoDia} / día
                </span>
            </div>
            </div>

            {/* Banner con el Total General */}
            <div className="mt-6 flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/80 p-4 sm:p-5">
            <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-teal-800">
                Costo Total Operativo
                </span>
                <span className="text-xs text-teal-600">Suma estimada de insumos y servicios</span>
            </div>
            <span className="text-2xl font-extrabold text-teal-900 sm:text-3xl">
                Q{/*costoTotal.toFixed(2)*/}
            </span>
            </div>
        </div>
        </div>
    );
}