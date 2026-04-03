import axios from "axios";

const API = import.meta.env.VITE_URL_BACK || "http://localhost:4000";

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchAllPedidos = () =>
  axios.get(`${API}/api/pedidos`, getHeaders()).then((r) => r.data);

export const updateEstadoPedido = (id, estado) =>
  axios.put(`${API}/api/pedidos/${id}/estado`, { estado }, getHeaders()).then((r) => r.data);
