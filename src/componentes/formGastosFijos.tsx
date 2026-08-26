import { type ChangeEvent, type FormEvent } from "react"
import { supabase } from "../lib/supabaseClient";
import { useCotizadorViaje } from "../hooks/useCotizadorViaje";

export const GastosFijosForm = () => {

  /*const [gastosFijos, setGastosFijos] = useState<GastosFijos>({
    kmPorLitro: 0,
    depreciacionKm: 0,
    choferPorDia: 0,
    viaticosChoferDia: 0,
    reservaPorRiesgoDia: 0,
    precioCombustible: 0,
    utilidad: 0.20,
  });*/

  const {gastosFijos, setGastosFijos} = useCotizadorViaje()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGastosFijos((prev) => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Gastos guardados:', gastosFijos);

    const {error} = await supabase 
      .from('gastosFijos')
      .upsert([
        {
          id: 1,
          kmPorLitro: gastosFijos.kmPorLitro,
          depreciacionKm: gastosFijos.depreciacionKm,
          choferPorDia: gastosFijos.choferPorDia,
          viaticosChoferDia: gastosFijos.viaticosChoferDia,
          reservaPorRiesgoDia: gastosFijos.reservaPorRiesgoDia,
          precioCombustible: gastosFijos.precioCombustible,
          utilidad: gastosFijos.utilidad,
        }
      ])
    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      alert('¡Gastos fijos guardados correctamente!');
    }
  };

  

  return (
    <div className="mx-auto my-10 w-[min(100%-2rem,56rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-xl shadow-slate-200/70">
      <div className="border-b border-slate-200 bg-slate-900 px-6 py-7 text-white sm:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
          Configuración
        </p>
        <h2 className="m-0 flex items-center gap-3 text-2xl font-bold tracking-tight text-amber-300 sm:text-3xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </span>
          Parámetros de Gastos Fijos
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Configura los costos base de operación y mantenimiento para el cálculo de tarifas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-6 py-7 sm:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          
          {/* Rendimiento (Km/L) */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Rendimiento (Km por Litro)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                name="kmPorLitro"
                value={gastosFijos.kmPorLitro || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 pr-16 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
              />
              <span className="absolute right-3 top-2.5 rounded-md bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                km/L
              </span>
            </div>
          </div>

          {/* Precio del Combustible */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Precio del Combustible
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium">
                Q
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="precioCombustible"
                value={gastosFijos.precioCombustible || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 pl-9 pr-20 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
              />
              <span className="absolute right-3 top-2.5 rounded-md bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                / Litro
              </span>
            </div>
          </div>

          {/* Depreciación por Km */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Depreciación por Km
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium">
                Q
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="depreciacionKm"
                value={gastosFijos.depreciacionKm || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 pl-9 pr-16 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
              />
              <span className="absolute right-3 top-2.5 rounded-md bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                / Km
              </span>
            </div>
          </div>

          {/* Pago Chofer por Día 
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Sueldo Chofer por Día
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium">
                Q
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="choferPorDia"
                value={gastos.choferPorDia || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 pl-9 pr-16 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
              />
              <span className="absolute right-3 top-2.5 rounded-md bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                / Día
              </span>
            </div>
          </div>
          */}

          {/* Viáticos Chofer por Día 
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Viáticos Chofer por Día
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium">
                Q
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="viaticosChoferDia"
                value={gastos.viaticosChoferDia || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 pl-9 pr-16 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
              />
              <span className="absolute right-3 top-2.5 rounded-md bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                / Día
              </span>
            </div>
          </div>*/}

          {/* Reserva por Riesgo por Día */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Reserva por Riesgo
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium">
                Q
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="reservaPorRiesgoDia"
                value={gastosFijos.reservaPorRiesgoDia || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 pl-9 pr-16 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/15"
              />
              <span className="absolute right-3 top-2.5 rounded-md bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                / Día
              </span>
            </div>
          </div>

        </div>

        {/* Campo Destacado: Porcentaje de Utilidad */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900">
                Margen de Utilidad
              </label>
              <p className="text-xs text-slate-500">
                Porcentaje deseado de ganancia sobre el costo operativo.
              </p>
            </div>
            
            <div className="relative min-w-[140px]">
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={Math.round(gastosFijos.utilidad * 100)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setGastosFijos((prev) => ({ ...prev, utilidad: val / 100 }));
                }}
                className="w-full rounded-lg border border-amber-200 bg-white py-2 pl-3 pr-8 text-right font-bold text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15"
              />
                <span className="absolute right-3 top-2 font-bold text-amber-700">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() =>
              setGastosFijos({
                kmPorLitro: 0,
                depreciacionKm: 0,
                choferPorDia: 0,
                viaticosChoferDia: 0,
                reservaPorRiesgoDia: 0,
                precioCombustible: 0,
                utilidad: 0.20,
              })
            }
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            Limpiar
          </button>
          
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-colors hover:bg-teal-700 active:bg-teal-800"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Guardar Parámetros
          </button>
        </div>
      </form>
    </div>
  );
};