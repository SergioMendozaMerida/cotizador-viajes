// src/components/Navbar.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }:any) =>
    `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
        : 'text-slate-600 hover:bg-teal-50 hover:text-teal-800'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          
          {/* Logo / Título de la App */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-lg font-bold text-white shadow-sm shadow-teal-600/20">
              C
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Camposeco Xpres
            </span>
          </div>

          {/* Enlaces para Pantallas Grandes (Desktop) */}
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={linkClass}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Inicio
            </NavLink>

            <NavLink to="/config" className={linkClass}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuración
            </NavLink>
          </nav>

          {/* Botón de Menú Móvil */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-500/20"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isOpen && (
        <div className="space-y-1 border-t border-slate-200 bg-slate-50 px-4 pb-4 pt-2 md:hidden">
          <NavLink to="/" onClick={() => setIsOpen(false)} className={linkClass}>
            Inicio
          </NavLink>
          <NavLink to="/config" onClick={() => setIsOpen(false)} className={linkClass}>
            Configuración
          </NavLink>
        </div>
      )}
    </header>
  );
};