import type { Costos, IngresoDatosViaje } from "../../interfaces/datosViaje"

interface Props {
    datosViaje: IngresoDatosViaje
    gastosFijos: any
    costos: Costos
}

export const CardsCostoViaje = ({datosViaje, gastosFijos, costos}: Props) => {

    //const costoTotal = Object.values(costos).reduce((acc, curr) => acc + curr, 0);

    const costoViaje = (costos.combustible + costos.depreciacion + costos.salarioChofer + costos.viaticosChofer
        + costos.reservaRiesgo
    )

    const utilidad = (costoViaje * gastosFijos.utilidad)
    const totalACobrar = costoViaje + utilidad

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
                ~{costos.litrosCombustible.toFixed(1)} L (Q{gastosFijos.precioCombustible}/L)
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

            {/* Resumen financiero */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Costo Total Operativo
                </span>
                <span className="mt-2 block text-xl font-extrabold text-slate-900">
                Q{costoViaje.toFixed(2)}
                </span>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <span className="block text-xs font-bold uppercase tracking-wider text-amber-800">
                Utilidad ({(gastosFijos.utilidad * 100).toFixed(0)}%)
                </span>
                <span className="mt-2 block text-xl font-extrabold text-amber-900">
                Q{utilidad.toFixed(2)}
                </span>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-4 sm:p-5">
                <span className="block text-xs font-bold uppercase tracking-wider text-teal-800">
                Total a Cobrar
                </span>
                <span className="mt-2 block text-2xl font-extrabold text-teal-900 sm:text-3xl">
                Q{totalACobrar.toFixed(2)}
                </span>
            </div>
            </div>
        </div>
        </div>
    );
}