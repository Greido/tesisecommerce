import axios from "axios";

const API = import.meta.env.VITE_URL_BACK || "http://localhost:4000";

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const crearTurno = (data) =>
  axios.post(`${API}/api/turnos`, data, getHeaders()).then((r) => r.data);

export const fetchMisTurnos = () =>
  axios.get(`${API}/api/turnos/mis-turnos`, getHeaders()).then((r) => r.data);

export const cancelarTurno = (id) =>
  axios.delete(`${API}/api/turnos/${id}`, getHeaders()).then((r) => r.data);

export const fetchAllTurnos = () =>
  axios.get(`${API}/api/turnos`, getHeaders()).then((r) => r.data);

export const updateEstadoTurno = (id, estado) =>
  axios.put(`${API}/api/turnos/${id}/estado`, { estado }, getHeaders()).then((r) => r.data);
