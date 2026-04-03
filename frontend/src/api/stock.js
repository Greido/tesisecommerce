import axios from "axios";

const API = import.meta.env.VITE_URL_BACK || "http://localhost:4000";

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchProductos = () =>
  axios.get(`${API}/api/stock`, getHeaders()).then((r) => r.data);

export const fetchProductoById = (id) =>
  axios.get(`${API}/api/stock/${id}`, getHeaders()).then((r) => r.data);

export const crearProducto = (data) =>
  axios.post(`${API}/api/stock`, data, getHeaders()).then((r) => r.data);

export const editarProducto = (id, data) =>
  axios.put(`${API}/api/stock/${id}`, data, getHeaders()).then((r) => r.data);

export const eliminarProducto = (id) =>
  axios.delete(`${API}/api/stock/${id}`, getHeaders()).then((r) => r.data);
