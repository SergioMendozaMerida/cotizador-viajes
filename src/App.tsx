import './App.css'
import 'leaflet/dist/leaflet.css';
import { HomePage } from './pages/HomePage'
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './componentes/navBar';
import { ConfiguracionesPage } from './pages/configuracionesPage';

function App() {

  return (
    <>
      <HashRouter>
        <Navbar />
        <main style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/config" element={<ConfiguracionesPage />} />
            {/* Ruta para manejar URLs no encontradas (404) */}
            <Route path="*" element={<h2>Página no encontrada</h2>} />
          </Routes>
        </main>
      </HashRouter>
    </>
  )
}

export default App
