import {
  Alert,
  Box,
  Chip,
  Collapse,
  Container,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import { fetchAllPedidos, updateEstadoPedido } from "../../api/pedidos.js";

const ESTADOS = ["Pendiente", "Confirmado", "Enviado", "Completado", "Cancelado"];

const ESTADO_COLOR = {
  Pendiente:   "warning",
  Confirmado:  "info",
  Enviado:     "primary",
  Completado:  "success",
  Cancelado:   "error",
};

const headSx = { color: "#9ca3af", fontWeight: 700, borderBottom: "1px solid #374151" };
const cellSx = { color: "#f9fafb", borderBottom: "1px solid #1f2937" };

function FilaPedido({ pedido, onEstadoChange }) {
  const [open, setOpen] = useState(false);
  const [estado, setEstado] = useState(pedido.estado);
  const [saving, setSaving] = useState(false);

  const handleEstado = async (nuevoEstado) => {
    setSaving(true);
    try {
      await updateEstadoPedido(pedido.id_pedido, nuevoEstado);
      setEstado(nuevoEstado);
      onEstadoChange();
    } catch {
      // silencioso — podés agregar un snackbar si querés
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TableRow sx={{ ":hover": { backgroundColor: "#1a1a1a" } }}>
        <TableCell sx={{ ...cellSx, width: 40, pr: 0 }}>
          <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: "#9ca3af" }}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={cellSx}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>#{pedido.id_pedido}</Typography>
        </TableCell>
        <TableCell sx={cellSx}>
          <Typography variant="body2">{pedido.cliente}</Typography>
          <Typography variant="caption" sx={{ color: "#9ca3af" }}>{pedido.email}</Typography>
        </TableCell>
        <TableCell sx={cellSx}>
          <Typography variant="body2" sx={{ color: "#9ca3af" }}>
            {new Date(pedido.created_at).toLocaleDateString("es-AR", {
              day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
            })}
          </Typography>
        </TableCell>
        <TableCell sx={cellSx}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: "#22c55e" }}>
            ${Number(pedido.total).toFixed(2)}
          </Typography>
        </TableCell>
        <TableCell sx={{ borderBottom: "1px solid #1f2937" }}>
          <Select
            value={estado}
            onChange={(e) => handleEstado(e.target.value)}
            disabled={saving}
            size="small"
            sx={{
              color: "#f9fafb",
              fontSize: 13,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#374151" },
              "& .MuiSvgIcon-root": { color: "#9ca3af" },
              "& .MuiSelect-select": { py: 0.75 },
            }}
          >
            {ESTADOS.map((e) => (
              <MenuItem key={e} value={e}>{e}</MenuItem>
            ))}
          </Select>
        </TableCell>
      </TableRow>

      {/* Detalle del pedido */}
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0, borderBottom: "1px solid #374151", backgroundColor: "#0d0d0d" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ px: 3, py: 2 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                {/* Items */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    Productos
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {pedido.items.map((item) => (
                      <Stack key={item.id_item} direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: "#e5e7eb" }}>
                          {item.nombre} × {item.cantidad}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#22c55e", fontWeight: 600 }}>
                          ${(Number(item.precio) * item.cantidad).toFixed(2)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ borderColor: "#374151", display: { xs: "none", sm: "block" } }} />

                {/* Entrega */}
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    Entrega
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e5e7eb", mt: 1 }}>
                    {pedido.direccion ?? "Sin dirección"}
                  </Typography>
                  {pedido.observaciones && (
                    <Typography variant="caption" sx={{ color: "#9ca3af", mt: 0.5, display: "block" }}>
                      {pedido.observaciones}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      setPedidos(await fetchAllPedidos());
    } catch {
      setError("Error al cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // Resumen por estado
  const resumen = ESTADOS.reduce((acc, e) => {
    acc[e] = pedidos.filter((p) => p.estado === e).length;
    return acc;
  }, {});

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0f0f0f" }}>
      <AdminNavbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff", mb: 1 }}>
          Pedidos
        </Typography>

        {/* Chips de resumen */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3 }}>
          {ESTADOS.map((e) => (
            <Chip
              key={e}
              label={`${e}: ${resumen[e] ?? 0}`}
              color={ESTADO_COLOR[e]}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TableContainer component={Paper} sx={{ backgroundColor: "#1a1a1a", borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headSx, width: 40 }} />
                {["Pedido", "Cliente", "Fecha", "Total", "Estado"].map((h) => (
                  <TableCell key={h} sx={headSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j} sx={{ borderBottom: "1px solid #374151" }}>
                          <Skeleton variant="text" sx={{ bgcolor: "#374151" }} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : pedidos.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ color: "#9ca3af", py: 6, borderBottom: "none" }}>
                        No hay pedidos todavía.
                      </TableCell>
                    </TableRow>
                  )
                  : pedidos.map((p) => (
                    <FilaPedido key={p.id_pedido} pedido={p} onEstadoChange={cargar} />
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
