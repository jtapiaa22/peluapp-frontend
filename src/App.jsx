import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users } from 'lucide-react'
import Dashboard      from './pages/Dashboard'
import Clientes       from './pages/Clientes'
import ClienteDetalle from './pages/ClienteDetalle'

export default function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', background: '#0f0f0f', color: '#f5f5f5' }}>

      {/* Sidebar — solo desktop */}
      <aside className="sidebar">
        <div style={{ padding: '0 8px 24px', fontWeight: 700, fontSize: 16, color: '#a78bfa', borderBottom: '1px solid #3b2f6e', marginBottom: 8 }}>
          🔑 LicenciasApp
        </div>
        <NavLink to="/" end style={({ isActive }) => navStyle(isActive)}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink to="/clientes" style={({ isActive }) => navStyle(isActive)}>
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
        <NavLink to="/" end style={({ isActive }) => bottomNavStyle(isActive)}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/clientes" style={({ isActive }) => bottomNavStyle(isActive)}>
          <Users size={20} />
          <span>Clientes</span>
        </NavLink>
      </nav>

    </div>
  )
}

function navStyle(isActive) {
  return {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', borderRadius: 8,
    textDecoration: 'none', fontSize: 14, fontWeight: isActive ? 600 : 400,
    background: isActive ? '#2d1f5e' : 'transparent',
    color: isActive ? '#c4b5fd' : '#a1a1aa',
    transition: 'all 0.2s'
  }
}

function bottomNavStyle(isActive) {
  return {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    textDecoration: 'none', fontSize: 11, fontWeight: isActive ? 600 : 400,
    color: isActive ? '#c4b5fd' : '#a1a1aa',
    flex: 1, padding: '8px 0'
  }
}
