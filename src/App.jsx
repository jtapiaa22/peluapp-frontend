import { Routes, Route, NavLink } from 'react-router-dom'
import { LayoutDashboard, Users } from 'lucide-react'
import Dashboard      from './pages/Dashboard'
import Clientes       from './pages/Clientes'
import ClienteDetalle from './pages/ClienteDetalle'

console.log('API URL:', import.meta.env.VITE_API_URL)


export default function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', background: '#0f0f0f', color: '#f5f5f5' }}>

      {/* Sidebar */}
      <aside style={{ width: 220, background: '#141414', borderRight: '1px solid #3b2f6e', display: 'flex', flexDirection: 'column', padding: '24px 12px', gap: 8 }}>
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
      <main style={{ flex: 1, padding: '32px 48px', overflowY: 'auto' }}>
        <Routes>
          <Route path="/"               element={<Dashboard />} />
          <Route path="/clientes"       element={<Clientes />} />
          <Route path="/clientes/:id"   element={<ClienteDetalle />} />
        </Routes>
      </main>

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
