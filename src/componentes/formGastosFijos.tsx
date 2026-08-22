import { useState, type ChangeEvent, type FormEvent } from "react"
import type { GastosFijos } from "../interfaces/datosViaje"
import { supabase } from "../lib/supabaseClient";

export const GastosFijosForm = () => {
  const [gastos, setGastos] = useState<GastosFijos>({
    kmPorLitro: 0,
    depreciacionKm: 0,
    choferPorDia: 0,
    viaticosChoferDia: 0,
    reservaPorRiesgoDia: 0,
    precioCombustible: 0,
    utilidad: 0.20,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGastos((prev) => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Gastos guardados:', gastos);

    const {error} = await supabase 
      .from('gastosFijos')
      .upsert([
        {
          id: 1,
          kmPorLitro: gastos.kmPorLitro,
          depreciacionKm: gastos.depreciacionKm,
          choferPorDia: gastos.choferPorDia,
          viaticosChoferDia: gastos.viaticosChoferDia,
          reservaPorRiesgoDia: gastos.reservaPorRiesgoDia,
          precioCombustible: gastos.precioCombustible,
          utilidad: gastos.utilidad,
        }
      ])
    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      alert('¡Gastos fijos guardados correctamente!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      {/* Encabezado */}
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </span>
          Parámetros de Gastos Fijos
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configura los costos base de operación y mantenimiento para el cálculo de tarifas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Rendimiento (Km/L) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Rendimiento (Km por Litro)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                name="kmPorLitro"
                value={gastos.kmPorLitro || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-3 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
                km/L
              </span>
            </div>
          </div>

          {/* Precio del Combustible */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Precio del Combustible
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="precioCombustible"
                value={gastos.precioCombustible || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-8 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
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
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="depreciacionKm"
                value={gastos.depreciacionKm || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-8 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
                / Km
              </span>
            </div>
          </div>

          {/* Pago Chofer por Día */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Sueldo Chofer por Día
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="choferPorDia"
                value={gastos.choferPorDia || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-8 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
                / Día
              </span>
            </div>
          </div>

          {/* Viáticos Chofer por Día */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Viáticos Chofer por Día
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="viaticosChoferDia"
                value={gastos.viaticosChoferDia || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-8 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
                / Día
              </span>
            </div>
          </div>

          {/* Reserva por Riesgo por Día */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Reserva por Riesgo
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="reservaPorRiesgoDia"
                value={gastos.reservaPorRiesgoDia || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-8 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
                / Día
              </span>
            </div>
          </div>

        </div>

        {/* Campo Destacado: Porcentaje de Utilidad */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
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
                value={Math.round(gastos.utilidad * 100)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setGastos((prev) => ({ ...prev, utilidad: val / 100 }));
                }}
                className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold text-right focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span className="absolute right-3 top-2 text-slate-500 font-bold">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() =>
              setGastos({
                kmPorLitro: 0,
                depreciacionKm: 0,
                choferPorDia: 0,
                viaticosChoferDia: 0,
                reservaPorRiesgoDia: 0,
                precioCombustible: 0,
                utilidad: 0.20,
              })
            }
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Limpiar
          </button>
          
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition-colors flex items-center gap-2"
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