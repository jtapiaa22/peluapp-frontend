import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { getClientes, createCliente, updateCliente, deleteCliente } from '../api/api'

export default function Clientes() {
  const [clientes, setClientes]       = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando]       = useState(null)
  const [form, setForm]               = useState({ nombre: '', peluqueria: '', whatsapp: '', email: '', notas: '' })
  const [error, setError]             = useState('')
  const navigate = useNavigate()

  const cargar = () => getClientes().then(r => setClientes(r.data))
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return }
    setError('')
    if (editando) {
      await updateCliente(editando, form)
    } else {
      await createCliente(form)
    }
    setForm({ nombre: '', peluqueria: '', whatsapp: '', email: '', notas: '' })
    setEditando(null)
    setMostrarForm(false)
    cargar()
  }

  const editar = (c) => {
    setForm({ nombre: c.nombre, peluqueria: c.peluqueria, whatsapp: c.whatsapp, email: c.email, notas: c.notas })
    setEditando(c.id)
    setMostrarForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este cliente y todas sus licencias?')) return
    await deleteCliente(id)
    cargar()
  }

  const estadoLicencia = (hasta) => {
    if (!hasta) return { label: 'Sin licencia', color: '#737373' }
    const dias = Math.ceil((new Date(hasta) - new Date()) / (1000 * 60 * 60 * 24))
    if (dias <= 0)   return { label: 'Vencida',               color: '#f87171' }
    if (dias <= 10)  return { label: `${dias}d restantes`,    color: '#fbbf24' }
    return                   { label: `${dias}d restantes`,    color: '#4ade80' }
  }

  return (
    <div>
      <div className="header-flex">
        <h1>Clientes</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => { 
            setMostrarForm(!mostrarForm); 
            setEditando(null); 
            setForm({ nombre: '', peluqueria: '', whatsapp: '', email: '', notas: '' }) 
          }}
        >
          <Plus size={16} /> Agregar cliente
        </button>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <div className="card">
          <h3>{editando ? 'Editar cliente' : 'Nuevo cliente'}</h3>
          {error && <p className="error">{error}</p>}
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre *</label>
              <input 
                className="input" 
                value={form.nombre} 
                onChange={e => setForm({ ...form, nombre: e.target.value })} 
                placeholder="Nombre completo" 
              />
            </div>
            <div className="form-group">
              <label>Peluquería</label>
              <input 
                className="input" 
                value={form.peluqueria} 
                onChange={e => setForm({ ...form, peluqueria: e.target.value })} 
                placeholder="Nombre del negocio" 
              />
            </div>
            <div className="form-group">
              <label>WhatsApp</label>
              <input 
                className="input" 
                value={form.whatsapp} 
                onChange={e => setForm({ ...form, whatsapp: e.target.value })} 
                placeholder="+54 9 ..." 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                className="input" 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
                placeholder="correo@ejemplo.com" 
              />
            </div>
            <div className="form-group full-width">
              <label>Notas</label>
              <input 
                className="input" 
                value={form.notas} 
                onChange={e => setForm({ ...form, notas: e.target.value })} 
                placeholder="Observaciones..." 
              />
            </div>
          </div>
          <div className="btn-group">
            <button className="btn btn-primary" onClick={guardar}>Guardar</button>
            <button className="btn btn-secondary" onClick={() => setMostrarForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Peluquería</th>
              <th>WhatsApp</th>
              <th>Licencias</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => {
              const estado = estadoLicencia(c.ultima_hasta)
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.nombre}</td>
                  <td style={{ color: '#a1a1aa' }}>{c.peluqueria || '—'}</td>
                  <td style={{ color: '#a1a1aa' }}>{c.whatsapp || '—'}</td>
                  <td style={{ textAlign: 'center' }}>{c.total_licencias}</td>
                  <td><span style={{ color: estado.color, fontWeight: 600, fontSize: 13 }}>{estado.label}</span></td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-secondary" onClick={() => navigate(`/clientes/${c.id}`)} title="Ver detalle">
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-secondary" onClick={() => editar(c)} title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-danger" onClick={() => eliminar(c.id)} title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-state">
                  No hay clientes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
