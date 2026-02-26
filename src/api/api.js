import axios from 'axios'

const apiLocal = axios.create({
  baseURL: 'http://localhost:3001/api'
})

const apiLicencias = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
})

export const getStats         = ()          => apiLocal.get('/stats')
export const getClientes      = ()          => apiLocal.get('/clientes')
export const getCliente       = (id)        => apiLocal.get(`/clientes/${id}`)
export const createCliente    = (data)      => apiLocal.post('/clientes', data)
export const updateCliente    = (id, data)  => apiLocal.put(`/clientes/${id}`, data)
export const deleteCliente    = (id)        => apiLocal.delete(`/clientes/${id}`)
export const getLicencias     = (clienteId) => apiLocal.get(`/licencias/cliente/${clienteId}`)
export const createLicencia   = (data)      => apiLocal.post('/licencias', data)
export const deleteLicencia   = (id)        => apiLocal.delete(`/licencias/${id}`)

export const enviarEmail = (licencia) => apiLicencias.post('/notificaciones/email', {
  id:           licencia.id,
  nombre:       licencia.nombre,
  peluqueria:   licencia.peluqueria,
  email:        licencia.email,
  desde:        licencia.desde,
  hasta:        licencia.hasta,
  licencia_b64: licencia.licencia_b64
})

export const getLicenciaDownloadUrl = (id) => `${apiLicencias.defaults.baseURL}/licencias/${id}/download`
