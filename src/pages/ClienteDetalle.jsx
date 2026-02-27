import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Copy, Check, Download, Mail, MessageCircle } from 'lucide-react'
import { getCliente, getLicencias, createLicencia, deleteLicencia, enviarEmail, getLicenciaDownloadUrl } from '../api/api'

function hoy() { 
  return new Date().toISOString().split('T')[0] 
}
function en1Mes() {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().split('T')[0]
}

export default function ClienteDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente]         = useState(null)
  const [licencias, setLicencias]     = useState([])
  const [form, setForm]               = useState({ desde: hoy(), hasta: en1Mes() })
  const [mostrarForm, setMostrarForm] = useState(false)
  const [copiado, setCopiado]         = useState(null)
  const [error, setError]             = useState('')
  const [enviando, setEnviando]       = useState(null)
  const [emailOk, setEmailOk]         = useState(null)

  const cargar = async () => {
    const [c, l] = await Promise.all([getCliente(id), getLicencias(id)])
    setCliente(c.data)
    setLicencias(l.data)
  }

  useEffect(() => { cargar() }, [id])

  const generar = async () => {
    if (!form.desde || !form.hasta) { 
      setError('Completá las fechas.') 
      return 
    }
    if (form.desde > form.hasta) { 
      setError('La fecha inicio no puede ser mayor al vencimiento.') 
      return 
    }
    setError('')
    try {
      await createLicencia({ cliente_id: id, ...form })
      setForm({ desde: hoy(), hasta: en1Mes() })
      setMostrarForm(false)
      cargar()
    } catch (e) {
      console.error('Error generando licencia:', e)
      setError(e?.response?.data?.error || 'Error al generar la licencia')
    }
  }

  const eliminar = async (licId) => {
    if (!confirm('¿Eliminar esta licencia?')) return
    await deleteLicencia(licId)
    cargar()
  }

  const copiar = (texto, licId) => {
    navigator.clipboard.writeText(texto)
    setCopiado(licId)
    setTimeout(() => setCopiado(null), 2000)
  }

  const descargar = (licencia_b64, desde, hasta) => {
    const blob = new Blob([licencia_b64], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `licencia-${desde}-al-${hasta}.lic`
    a.click()
    URL.revokeObjectURL(url)
  }

  const enviarMail = async (l) => {
    if (!cliente.email) {
      alert('El cliente no tiene email registrado.')
      return
    }
    setEnviando(l.id)
    try {
      await enviarEmail({
        id:           l.id,
        nombre:       cliente.nombre,
        peluqueria:   cliente.peluqueria,
        email:        cliente.email,
        desde:        l.desde,
        hasta:        l.hasta,
        licencia_b64: l.licencia_b64
      })
      setEmailOk(l.id)
      setTimeout(() => setEmailOk(null), 3000)
    } catch (e) {
      alert('Error al enviar el email.')
    } finally {
      setEnviando(null)
    }
  }

  const enviarWhatsApp = (l) => {
    if (!cliente.whatsapp) { 
      alert('El cliente no tiene WhatsApp registrado.') 
      return 
    }

    const numero = cliente.whatsapp.replace(/\D/g, '')
    const linkDescarga = getLicenciaDownloadUrl(l.id).trim()

    const mensajePlano =
      `🔑 Tu licencia de PeluApp\n` +
      `Hola ${cliente.nombre}! 👋\n\n` +
      `✅ Válida desde: ${l.desde}\n` +
      `📅 Válida hasta: ${l.hasta}\n\n` +
      `📥 ${linkDescarga}\n\n` +
      `*Instrucciones:*\n` +
      `1. Descargá el archivo del link\n` +
      `2. Abrí PeluApp y cargá el archivo`

    const mensaje = encodeURIComponent(mensajePlano)
    window.open(`https://api.whatsapp.com/send?phone=${numero}&text=${mensaje}`, '_blank')
  }

  const estadoDias = (hasta) => {
    const dias = Math.ceil((new Date(hasta) - new Date()) / (1000 * 60 * 60 * 24))
    if (dias <= 0)  return { label: 'Vencida',                    color: '#f87171' }
    if (dias <= 10) return { label: `Vence en ${dias}d`,          color: '#fbbf24' }
    return                 { label: `Activa — ${dias}d restantes`, color: '#4ade80' }
  }

  if (!cliente) return <div className="loading">Cargando...</div>

  return (
    <div>
      {/* Header */}
      <div className="header-flex">
        <button className="btn btn-secondary" onClick={() => navigate('/clientes')}>
          <ArrowLeft size={16} />
        </button>
        <div className="cliente-header">
          <h1>{cliente.nombre}</h1>
          {cliente.peluqueria && <p className="cliente-subtitle">{cliente.peluqueria}</p>}
        </div>
      </div>

      {/* Info cliente */}
      <div className="card">
        <h3>Datos del cliente</h3>
        <div className="cliente-info-grid">
          <div className="info-row">
            <span className="info-label">WhatsApp:</span>
            <span>{cliente.whatsapp || '—'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span>{cliente.email || '—'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Notas:</span>
            <span>{cliente.notas || '—'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Cliente desde:</span>
            <span>{cliente.created_at}</span>
          </div>
        </div>
      </div>

      {/* Licencias */}
      <div className="card">
        <div className="header-flex">
          <h3>Licencias</h3>
          <button className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
            <Plus size={14} /> Nueva licencia
          </button>
        </div>

        {/* Form nueva licencia */}
        {mostrarForm && (
          <div className="license-form">
            <h3>Generar licencia</h3>
            {error && <p className="error">{error}</p>}
            <div className="form-row">
              <div className="form-group">
                <label>Desde</label>
                <input 
                  className="input" 
                  type="date" 
                  value={form.desde} 
                  onChange={e => setForm({ ...form, desde: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Hasta</label>
                <input 
                  className="input" 
                  type="date" 
                  value={form.hasta} 
                  onChange={e => setForm({ ...form, hasta: e.target.value })} 
                />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" onClick={generar}>Generar</button>
                <button className="btn btn-secondary" onClick={() => setMostrarForm(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Tabla licencias */}
        {licencias.length === 0 ? (
          <div className="empty-state">No hay licencias generadas</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Desde</th>
                  <th>Hasta</th>
                  <th>Estado</th>
                  <th>Generada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {licencias.map(l => {
                  const estado = estadoDias(l.hasta)
                  return (
                    <tr key={l.id}>
                      <td>{l.desde}</td>
                      <td>{l.hasta}</td>
                      <td><span className="estado-badge" style={{ color: estado.color }}>{estado.label}</span></td>
                      <td className="fecha-pequeña">{l.created_at}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-secondary"
                            onClick={() => copiar(l.licencia_b64, l.id)}
                            title="Copiar contenido"
                          >
                            {copiado === l.id ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => descargar(l.licencia_b64, l.desde, l.hasta)}
                            title="Descargar .lic"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => enviarMail(l)}
                            title="Enviar por email"
                            disabled={enviando === l.id}
                          >
                            {emailOk === l.id
                              ? <Check size={14} color="#4ade80" />
                              : <Mail size={14} color={enviando === l.id ? '#555' : '#60a5fa'} />
                            }
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => enviarWhatsApp(l)}
                            title="Enviar por WhatsApp"
                          >
                            <MessageCircle size={14} color="#4ade80" />
                          </button>
                          <button className="btn btn-danger" onClick={() => eliminar(l.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
