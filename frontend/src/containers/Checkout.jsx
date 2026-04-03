import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../auth/CartContext.jsx";

const API = import.meta.env.VITE_URL_BACK || "http://localhost:4000";

const METODOS = [
  {
    id: "mercadopago",
    label: "MercadoPago",
    desc: "Tarjeta, débito, dinero en cuenta",
    logo: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.21.22/mercadopago/logo__large@2x.png",
  },
  {
    id: "efectivo",
    label: "Efectivo / Contra entrega",
    desc: "Pagás al recibir el pedido",
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 36, color: "#9ca3af" }} />,
  },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#374151" },
    "&:hover fieldset": { borderColor: "#22c55e" },
    "&.Mui-focused fieldset": { borderColor: "#22c55e" },
  },
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, vaciar } = useCart();
  const [metodo, setMetodo] = useState("mercadopago");
  const [direccion, setDireccion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);

  if (items.length === 0 && !success) {
    navigate("/dashboard");
    return null;
  }

  const handleConfirmar = async () => {
    if (!direccion.trim()) {
      setError("Ingresá una dirección de entrega.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (metodo === "mercadopago") {
        // Crear preferencia y redirigir a MP sandbox
        const res = await axios.post(
          `${API}/api/pagos/crear-preferencia`,
          { items: items.map((i) => ({ id_producto: i.id_producto, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad })), direccion, observaciones },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        // Redirigir al sandbox de MP
        window.location.href = res.data.sandbox_init_point;
      } else {
        // Pago en efectivo — crear pedido directo
        const res = await axios.post(
          `${API}/api/pedidos`,
          { items: items.map((i) => ({ id_producto: i.id_producto, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad })), direccion, observaciones },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setPedidoId(res.data.id_pedido);
        vaciar();
        setSuccess(true);
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Error al procesar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <PantallaExito pedidoId={pedidoId} navigate={navigate} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#050805", py: 4 }}>
      <Container maxWidth="md">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard")}
          sx={{ color: "#9ca3af", mb: 2 }}>
          Volver a la tienda
        </Button>

        <Typography variant="h5" sx={{ fontWeight: 700, color: "#f9fafb", mb: 3 }}>
          Confirmar pedido
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">

          {/* Columna izquierda */}
          <Stack spacing={3} sx={{ flex: 1, width: "100%" }}>

            {/* Resumen */}
            <Paper sx={{ p: 3, backgroundColor: "#0d1f0d", borderRadius: 3, border: "1px solid rgba(34,197,94,0.2)" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Resumen
              </Typography>
              <Stack spacing={1.5}>
                {items.map((item) => (
                  <Stack key={item.id_producto} direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: "#e5e7eb" }}>
                      {item.nombre} × {item.cantidad}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#22c55e", fontWeight: 600 }}>
                      ${(Number(item.precio) * item.cantidad).toFixed(2)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ borderColor: "#1f2937", my: 2 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#22c55e" }}>
                  ${total.toFixed(2)}
                </Typography>
              </Stack>
            </Paper>

            {/* Método de pago */}
            <Paper sx={{ p: 3, backgroundColor: "#1a1a1a", borderRadius: 3, border: "1px solid #374151" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Método de pago
              </Typography>
              <Stack spacing={1.5}>
                {METODOS.map((m) => (
                  <Box
                    key={m.id}
                    onClick={() => setMetodo(m.id)}
                    sx={{
                      p: 2, borderRadius: 2, cursor: "pointer",
                      border: metodo === m.id
                        ? "2px solid #22c55e"
                        : "2px solid #374151",
                      backgroundColor: metodo === m.id ? "rgba(34,197,94,0.08)" : "#111",
                      transition: "all 0.2s",
                      display: "flex", alignItems: "center", gap: 2,
                    }}
                  >
                    {m.logo
                      ? <Box component="img" src={m.logo} alt={m.label} sx={{ height: 28, objectFit: "contain" }} />
                      : m.icon
                    }
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#f9fafb" }}>
                        {m.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                        {m.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>

          {/* Columna derecha — entrega */}
          <Paper sx={{ p: 3, backgroundColor: "#1a1a1a", borderRadius: 3, border: "1px solid #374151", flex: 1, width: "100%" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Datos de entrega
            </Typography>
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField label="Dirección de entrega *" value={direccion}
                onChange={(e) => { setDireccion(e.target.value); setError(""); }}
                fullWidth placeholder="Ej: Av. Corrientes 1234, CABA"
                InputLabelProps={{ style: { color: "#9ca3af" } }}
                InputProps={{ style: { color: "#fff" } }}
                sx={fieldSx}
              />

              <TextField label="Observaciones" value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                fullWidth multiline rows={3}
                placeholder="Piso, departamento, referencias..."
                InputLabelProps={{ style: { color: "#9ca3af" } }}
                InputProps={{ style: { color: "#fff" } }}
                sx={fieldSx}
              />

              <Button variant="contained" onClick={handleConfirmar} disabled={loading}
                sx={{
                  bgcolor: metodo === "mercadopago" ? "#009ee3" : "#22c55e",
                  fontWeight: 700, py: 1.5,
                  ":hover": { bgcolor: metodo === "mercadopago" ? "#0077b6" : "#16a34a" },
                }}
              >
                {loading
                  ? "Procesando..."
                  : metodo === "mercadopago"
                    ? `Pagar con MercadoPago — $${total.toFixed(2)}`
                    : `Confirmar pedido — $${total.toFixed(2)}`
                }
              </Button>

              {metodo === "mercadopago" && (
                <Typography variant="caption" sx={{ color: "#6b7280", textAlign: "center" }}>
                  Serás redirigido al sitio de MercadoPago para completar el pago de forma segura.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

function PantallaExito({ pedidoId, navigate }) {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#050805", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Stack alignItems="center" spacing={3} sx={{ textAlign: "center", px: 4 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#22c55e" }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#f9fafb" }}>
          ¡Pedido confirmado!
        </Typography>
        <Typography sx={{ color: "#9ca3af" }}>
          Tu pedido #{pedidoId} fue recibido correctamente.<br />
          Te contactaremos cuando esté listo.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/dashboard")}
          sx={{ bgcolor: "#22c55e", fontWeight: 700, px: 4, ":hover": { bgcolor: "#16a34a" } }}>
          Volver a la tienda
        </Button>
      </Stack>
    </Box>
  );
}
