import { useState, useEffect } from 'react'
import { Users, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { getStats } from '../api/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStats().then(r => setStats(r.data))
  }, [])

  if (!stats) return <p style={{ color: '#666' }}>Cargando...</p>

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Tarjetas */}
      <div className="stats-grid">
        <StatCard icon={<Users size={20} />} label="Total clientes" valor={stats.totalClientes} color="#a78bfa" />
        <StatCard icon={<CheckCircle size={20} />} label="Licencias activas" valor={stats.activas} color="#4ade80" />
        <StatCard icon={<AlertTriangle size={20} />} label="Vencen en 30 días" valor={stats.porVencer} color="#fbbf24" />
        <StatCard icon={<XCircle size={20} />} label="Vencidas" valor={stats.vencidas} color="#f87171" />
      </div>

      {/* Próximos a vencer */}
      {stats.proximosVencer.length > 0 ? (
        <div className="card">
          <h3>⚠️ Próximos a vencer</h3>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Peluquería</th>
                  <th>WhatsApp</th>
                  <th>Vence</th>
                  <th>Días</th>
                </tr>
              </thead>
              <tbody>
                {stats.proximosVencer.map((p, i) => {
                  const dias  = Math.ceil((new Date(p.hasta) - new Date()) / (1000 * 60 * 60 * 24)) + 1
                  const color = dias <= 5 ? '#f87171' : dias <= 10 ? '#fbbf24' : '#4ade80'
                  return (
                    <tr key={i}>
                      <td>{p.nombre}</td>
                      <td style={{ color: '#a1a1aa' }}>{p.peluqueria || '—'}</td>
                      <td style={{ color: '#a1a1aa' }}>{p.whatsapp || '—'}</td>
                      <td>{p.hasta}</td>
                      <td><span style={{ color, fontWeight: 700 }}>{dias}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', color: '#555', padding: 40 }}>
          ✅ No hay licencias próximas a vencer
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, valor, color }) {
  return (
    <div className="card" style={{ margin: 0, textAlign: 'center' }}>
      <div style={{ color, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color }}>{valor}</div>
      <div style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>{label}</div>
    </div>
  )
}
