import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export const getStats         = ()          => api.get('/stats')
export const getClientes      = ()          => api.get('/clientes')
export const getCliente       = (id)        => api.get(`/clientes/${id}`)
export const createCliente    = (data)      => api.post('/clientes', data)
export const updateCliente    = (id, data)  => api.put(`/clientes/${id}`, data)
export const deleteCliente    = (id)        => api.delete(`/clientes/${id}`)
export const getLicencias     = (clienteId) => api.get(`/licencias/cliente/${clienteId}`)
export const createLicencia   = (data)      => api.post('/licencias', data)
export const deleteLicencia   = (id)        => api.delete(`/licencias/${id}`)

export const enviarEmail = (licencia) => api.post('/notificaciones/email', {
  id:           licencia.id,
  nombre:       licencia.nombre,
  peluqueria:   licencia.peluqueria,
  email:        licencia.email,
  desde:        licencia.desde,
  hasta:        licencia.hasta,
  licencia_b64: licencia.licencia_b64
})

export const getLicenciaDownloadUrl = (id) => `${api.defaults.baseURL}/licencias/${id}/download`
