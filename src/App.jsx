import { Routes, Route, NavLink } from 'react-router-dom'
import { LayoutDashboard, Users } from 'lucide-react'
import Dashboard      from './pages/Dashboard'
import Clientes       from './pages/Clientes'
import ClienteDetalle from './pages/ClienteDetalle'

console.log('API URL:', import.meta.env.VITE_API_URL)

export default function App() {
  return (
    <div className="app-container">
      {/* Sidebar — solo desktop */}
      <aside className="sidebar">
        <div className="sidebar-header">
          🔑 LicenciasApp
        </div>
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink 
          to="/clientes" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Users size={16} /> Clientes
        </NavLink>
      </aside>

      {/* Main */}
      <main className="main-content">
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/clientes"     element={<Clientes />} />
          <Route path="/clientes/:id" element={<ClienteDetalle />} />
        </Routes>
      </main>

      {/* Bottom navbar — solo móvil */}
      <nav className="bottom-nav">
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/clientes" 
          className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
        >
          <Users size={20} />
          <span>Clientes</span>
        </NavLink>
      </nav>
    </div>
  )
}
