import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, CalendarMonth, Cancel, Pets } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { crearTurno, fetchMisTurnos, cancelarTurno } from "../api/turnos.js";

const SERVICIOS = ["Limpieza", "Atencion Veterinaria", "Vacunacion", "Peluqueria"];
const ESPECIES = ["Perro", "Gato", "Otro"];

const ESTADO_COLOR = {
  Pendiente: "warning",
  Confirmado: "success",
  Cancelado: "error",
  Completado: "info",
};

function formatFecha(fechaHora) {
  return new Date(fechaHora).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const cellSx = { color: "#f9fafb", borderBottom: "1px solid #1f2937" };

export default function Turnos() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const [form, setForm] = useState({
    nombre_mascota: "",
    especie_mascota: "Perro",
    servicio: "",
    fecha_hora: "",
    observaciones: "",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const cargar = async () => {
    setLoading(true);
    try {
      setTurnos(await fetchMisTurnos());
    } catch {
      setSnack({ open: true, msg: "Error al cargar turnos", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async () => {
    if (!form.nombre_mascota.trim() || !form.servicio || !form.fecha_hora) {
      setFormError("Completá todos los campos obligatorios.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await crearTurno(form);
      setSnack({ open: true, msg: "Turno solicitado con exito", severity: "success" });
      setDialogOpen(false);
      setForm({ nombre_mascota: "", especie_mascota: "Perro", servicio: "", fecha_hora: "", observaciones: "" });
      cargar();
    } catch (err) {
      setFormError(err.response?.data?.error ?? err.message ?? "Error al solicitar turno");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelar = async () => {
    try {
      await cancelarTurno(cancelId);
      setSnack({ open: true, msg: "Turno cancelado", severity: "info" });
      cargar();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.error ?? "Error al cancelar", severity: "error" });
    } finally {
      setCancelId(null);
    }
  };

  // Fecha mínima: ahora + 1 hora redondeado
  const minFecha = (() => {
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  })();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#050805", color: "#f9fafb" }}>
      {/* Navbar */}
      <Box sx={{
        px: 4, py: 2,
        borderBottom: "1px solid rgba(45,107,45,0.3)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(180deg, rgba(14,32,14,1) 0%, rgba(6,12,6,1) 100%)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5} onClick={() => navigate("/dashboard")}
          sx={{ cursor: "pointer", ":hover": { opacity: 0.8 } }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 2,
            background: "radial-gradient(circle at 30% 30%, #4ade80, #22c55e, #14532d)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Pets sx={{ color: "#f9fafb", fontSize: 22 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>AnimalZoo</Typography>
        </Stack>

        <Typography variant="body2" sx={{ color: "#9ca3af" }}>
          Hola, <strong style={{ color: "#f9fafb" }}>{user?.nombre}</strong>
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <CalendarMonth sx={{ color: "#22c55e", fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Turnos Veterinaria</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#9ca3af", mt: 0.5 }}>
              Agendá un turno para tu mascota
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            sx={{ bgcolor: "#22c55e", ":hover": { bgcolor: "#16a34a" }, fontWeight: 700 }}
          >
            Nuevo turno
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress sx={{ color: "#22c55e" }} />
          </Box>
        ) : turnos.length === 0 ? (
          <Box sx={{
            textAlign: "center", py: 10,
            border: "1px dashed rgba(34,197,94,0.2)", borderRadius: 3,
          }}>
            <CalendarMonth sx={{ fontSize: 56, color: "rgba(34,197,94,0.25)", mb: 2 }} />
            <Typography sx={{ color: "#9ca3af" }}>No tenés turnos agendados todavía.</Typography>
            <Button
              onClick={() => setDialogOpen(true)}
              sx={{ mt: 2, color: "#22c55e", textDecoration: "underline" }}
            >
              Solicitá tu primer turno
            </Button>
          </Box>
        ) : (
          <Stack spacing={2}>
            {turnos.map((t) => (
              <Box
                key={t.id_turno}
                sx={{
                  backgroundColor: "#0d1f0d",
                  border: "1px solid rgba(34,197,94,0.15)",
                  borderRadius: 3,
                  p: 2.5,
                }}
              >
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-start" }} spacing={1.5}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {t.nombre_mascota}
                      </Typography>
                      <Chip label={t.especie_mascota} size="small"
                        sx={{ bgcolor: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)", fontSize: 11 }} />
                    </Stack>
                    <Typography variant="body2" sx={{ color: "#4ade80", fontWeight: 600 }}>{t.servicio}</Typography>
                    <Typography variant="body2" sx={{ color: "#9ca3af", mt: 0.5 }}>
                      {formatFecha(t.fecha_hora)}
                    </Typography>
                    {t.observaciones && (
                      <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mt: 0.5 }}>
                        {t.observaciones}
                      </Typography>
                    )}
                  </Box>

                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexShrink: 0 }}>
                    <Chip
                      label={t.estado}
                      color={ESTADO_COLOR[t.estado] ?? "default"}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                    {t.estado === "Pendiente" && (
                      <Button
                        size="small"
                        startIcon={<Cancel sx={{ fontSize: 14 }} />}
                        onClick={() => setCancelId(t.id_turno)}
                        sx={{ color: "#f87171", fontSize: 12, ":hover": { bgcolor: "rgba(239,68,68,0.1)" } }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Container>

      {/* Dialog: nuevo turno */}
      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setFormError(""); }}
        maxWidth="xs" fullWidth
        PaperProps={{ sx: { backgroundColor: "#1a1a1a", border: "1px solid #374151", borderRadius: 3 } }}>
        <DialogTitle sx={{ color: "#f9fafb", fontWeight: 700 }}>Solicitar turno</DialogTitle>
        <Divider sx={{ borderColor: "#374151" }} />
        <DialogContent sx={{ pt: 2.5 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Nombre de la mascota *"
              value={form.nombre_mascota}
              onChange={(e) => setForm((f) => ({ ...f, nombre_mascota: e.target.value }))}
              fullWidth size="small"
              InputLabelProps={{ sx: { color: "#9ca3af" } }}
              InputProps={{ sx: { color: "#f9fafb" } }}
              sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#374151" }, "&:hover fieldset": { borderColor: "#22c55e" }, "&.Mui-focused fieldset": { borderColor: "#22c55e" } } }}
            />

            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "#9ca3af" }}>Especie</InputLabel>
              <Select value={form.especie_mascota} label="Especie"
                onChange={(e) => setForm((f) => ({ ...f, especie_mascota: e.target.value }))}
                sx={{ color: "#f9fafb", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#374151" }, "& .MuiSvgIcon-root": { color: "#9ca3af" } }}>
                {ESPECIES.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "#9ca3af" }}>Servicio *</InputLabel>
              <Select value={form.servicio} label="Servicio *"
                onChange={(e) => setForm((f) => ({ ...f, servicio: e.target.value }))}
                sx={{ color: "#f9fafb", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#374151" }, "& .MuiSvgIcon-root": { color: "#9ca3af" } }}>
                {SERVICIOS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>

            <TextField
              label="Fecha y hora *"
              type="datetime-local"
              value={form.fecha_hora}
              onChange={(e) => setForm((f) => ({ ...f, fecha_hora: e.target.value }))}
              inputProps={{ min: minFecha }}
              fullWidth size="small"
              InputLabelProps={{ shrink: true, sx: { color: "#9ca3af" } }}
              InputProps={{ sx: { color: "#f9fafb" } }}
              sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#374151" }, "&:hover fieldset": { borderColor: "#22c55e" }, "&.Mui-focused fieldset": { borderColor: "#22c55e" } }, "& input::-webkit-calendar-picker-indicator": { filter: "invert(1)" } }}
            />

            <TextField
              label="Observaciones"
              value={form.observaciones}
              onChange={(e) => setForm((f) => ({ ...f, observaciones: e.target.value }))}
              fullWidth size="small" multiline rows={2}
              InputLabelProps={{ sx: { color: "#9ca3af" } }}
              InputProps={{ sx: { color: "#f9fafb" } }}
              sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#374151" }, "&:hover fieldset": { borderColor: "#22c55e" }, "&.Mui-focused fieldset": { borderColor: "#22c55e" } } }}
            />

            {formError && <Alert severity="error" sx={{ py: 0.5 }}>{formError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => { setDialogOpen(false); setFormError(""); }} sx={{ color: "#9ca3af" }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving} variant="contained"
            sx={{ bgcolor: "#22c55e", ":hover": { bgcolor: "#16a34a" }, fontWeight: 700 }}>
            {saving ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: confirmar cancelación */}
      <Dialog open={Boolean(cancelId)} onClose={() => setCancelId(null)}
        PaperProps={{ sx: { backgroundColor: "#1a1a1a", border: "1px solid #374151", borderRadius: 3 } }}>
        <DialogTitle sx={{ color: "#f9fafb" }}>Cancelar turno</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#9ca3af" }}>Esta acción no se puede deshacer. ¿Confirmás?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelId(null)} sx={{ color: "#9ca3af" }}>Volver</Button>
          <Button onClick={handleCancelar} variant="contained"
            sx={{ bgcolor: "#ef4444", ":hover": { bgcolor: "#b91c1c" } }}>
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
