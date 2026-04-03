import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearProducto } from "../../../api/stock.js";
import AdminNavbar from "../../../components/AdminNavbar.jsx";

const CATEGORIAS = ["Alimento", "Accesorios", "Farmacia", "Higiene"];
const UNIDADES = ["kg", "g", "unidad"];

const EMPTY = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock_actual: "",
  stock_minimo: "5",
  categoria: "",
  tipo_unidad: "",
  valor_medida: "",
  imagen_url: "",
};

export default function SubirProducto() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || form.precio === "" || form.stock_actual === "" || !form.categoria || !form.tipo_unidad || form.valor_medida === "") {
      setError("Completá todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    try {
      await crearProducto({
        ...form,
        precio: Number(form.precio),
        stock_actual: Number(form.stock_actual),
        stock_minimo: Number(form.stock_minimo),
        valor_medida: Number(form.valor_medida),
      });
      setSuccess("Producto cargado correctamente.");
      setForm(EMPTY);
    } catch (err) {
      setError(err?.response?.data?.error || "Error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#374151" }, "&:hover fieldset": { borderColor: "#22c55e" } },
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0f0f0f" }}>
      <AdminNavbar />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin-stock")}
          sx={{ color: "#9ca3af", mb: 2 }}
        >
          Volver
        </Button>

        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, mb: 3 }}>
          Cargar Producto
        </Typography>

        <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: "#1a1a1a" }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <TextField label="Nombre *" name="nombre" value={form.nombre} onChange={handleChange}
                fullWidth InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />

              <TextField label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange}
                fullWidth multiline rows={3}
                InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />

              <Stack direction="row" spacing={2}>
                <TextField select label="Categoría *" name="categoria" value={form.categoria} onChange={handleChange}
                  fullWidth InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx}>
                  {CATEGORIAS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>

                <TextField label="Precio *" name="precio" type="number" value={form.precio} onChange={handleChange}
                  fullWidth inputProps={{ min: 0, step: "0.01" }}
                  InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />
              </Stack>

              <Stack direction="row" spacing={2}>
                <TextField select label="Tipo de unidad *" name="tipo_unidad" value={form.tipo_unidad} onChange={handleChange}
                  fullWidth InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx}>
                  {UNIDADES.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                </TextField>

                <TextField label="Valor / medida *" name="valor_medida" type="number" value={form.valor_medida} onChange={handleChange}
                  fullWidth inputProps={{ min: 0, step: "0.01" }}
                  InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />
              </Stack>

              <Stack direction="row" spacing={2}>
                <TextField label="Stock actual *" name="stock_actual" type="number" value={form.stock_actual} onChange={handleChange}
                  fullWidth inputProps={{ min: 0 }}
                  InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />

                <TextField label="Stock mínimo" name="stock_minimo" type="number" value={form.stock_minimo} onChange={handleChange}
                  fullWidth inputProps={{ min: 0 }}
                  InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />
              </Stack>

              <TextField label="URL de imagen" name="imagen_url" value={form.imagen_url} onChange={handleChange}
                fullWidth InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />

              <Button type="submit" variant="contained" disabled={loading}
                sx={{ mt: 1, bgcolor: "#22c55e", color: "#fff", fontWeight: 700, ":hover": { bgcolor: "#16a34a" } }}>
                {loading ? "Guardando..." : "Guardar Producto"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

