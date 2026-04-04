import {
  Alert,
  Box,
  Chip,
  Container,
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
import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar.jsx";
import { fetchAllTurnos, updateEstadoTurno } from "../../api/turnos.js";

const ESTADOS = ["Pendiente", "Confirmado", "Cancelado", "Completado"];

const ESTADO_COLOR = {
  Pendiente: "warning",
  Confirmado: "success",
  Cancelado: "error",
  Completado: "info",
};

const headSx = { color: "#9ca3af", fontWeight: 700, borderBottom: "1px solid #374151" };
const cellSx = { color: "#f9fafb", borderBottom: "1px solid #1f2937" };

function formatFecha(fechaHora) {
  return new Date(fechaHora).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FilaTurno({ turno, onEstadoChange }) {
  const [estado, setEstado] = useState(turno.estado);
  const [saving, setSaving] = useState(false);

  const handleEstado = async (nuevoEstado) => {
    setSaving(true);
    try {
      await updateEstadoTurno(turno.id_turno, nuevoEstado);
      setEstado(nuevoEstado);
      onEstadoChange();
    } catch {
      // silencioso
    } finally {
      setSaving(false);
    }
  };

  return (
    <TableRow sx={{ ":hover": { backgroundColor: "#1a1a1a" } }}>
      <TableCell sx={cellSx}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>#{turno.id_turno}</Typography>
      </TableCell>
      <TableCell sx={cellSx}>
        <Typography variant="body2">{turno.cliente}</Typography>
        <Typography variant="caption" sx={{ color: "#9ca3af" }}>{turno.email}</Typography>
      </TableCell>
      <TableCell sx={cellSx}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{turno.nombre_mascota}</Typography>
        <Typography variant="caption" sx={{ color: "#4ade80" }}>{turno.especie_mascota}</Typography>
      </TableCell>
      <TableCell sx={cellSx}>
        <Typography variant="body2">{turno.servicio}</Typography>
      </TableCell>
      <TableCell sx={cellSx}>
        <Typography variant="body2" sx={{ color: "#9ca3af" }}>{formatFecha(turno.fecha_hora)}</Typography>
      </TableCell>
      <TableCell sx={cellSx}>
        {turno.observaciones ? (
          <Typography variant="caption" sx={{ color: "#9ca3af" }}>{turno.observaciones}</Typography>
        ) : (
          <Typography variant="caption" sx={{ color: "#374151" }}>—</Typography>
        )}
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
  );
}

export default function AdminTurnos() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      setTurnos(await fetchAllTurnos());
    } catch {
      setError("Error al cargar los turnos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const resumen = ESTADOS.reduce((acc, e) => {
    acc[e] = turnos.filter((t) => t.estado === e).length;
    return acc;
  }, {});

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0f0f0f" }}>
      <AdminNavbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff", mb: 1 }}>
          Turnos Veterinaria
        </Typography>

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
                {["#", "Cliente", "Mascota", "Servicio", "Fecha / Hora", "Observaciones", "Estado"].map((h) => (
                  <TableCell key={h} sx={headSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j} sx={{ borderBottom: "1px solid #374151" }}>
                          <Skeleton variant="text" sx={{ bgcolor: "#374151" }} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : turnos.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ color: "#9ca3af", py: 6, borderBottom: "none" }}>
                        No hay turnos registrados todavía.
                      </TableCell>
                    </TableRow>
                  )
                  : turnos.map((t) => (
                    <FilaTurno key={t.id_turno} turno={t} onEstadoChange={cargar} />
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
