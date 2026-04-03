import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProductos, editarProducto, eliminarProducto } from "../../../api/stock.js";
import AdminNavbar from "../../../components/AdminNavbar.jsx";

const CATEGORIAS = ["Alimento", "Accesorios", "Farmacia", "Higiene"];
const UNIDADES = ["kg", "g", "unidad"];

const EMPTY_FORM = {
  nombre: "", descripcion: "", precio: "", stock_actual: "", stock_minimo: "5",
  categoria: "", tipo_unidad: "", valor_medida: "", imagen_url: "",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#374151" }, "&:hover fieldset": { borderColor: "#22c55e" } },
};

export default function VerProductos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const cargar = async () => {
    setLoading(true);
    try {
      setProductos(await fetchProductos());
    } catch {
      setError("Error al cargar productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleEditOpen = (p) => {
    setEditId(p.id_producto);
    setEditForm({
      nombre: p.nombre, descripcion: p.descripcion ?? "",
      precio: p.precio, stock_actual: p.stock_actual, stock_minimo: p.stock_minimo ?? 5,
      categoria: p.categoria ?? "", tipo_unidad: p.tipo_unidad ?? "",
      valor_medida: p.valor_medida ?? "", imagen_url: p.imagen_url ?? "",
    });
    setEditError("");
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editForm.nombre || editForm.precio === "" || editForm.stock_actual === "" || !editForm.categoria || !editForm.tipo_unidad || editForm.valor_medida === "") {
      setEditError("Completá todos los campos obligatorios.");
      return;
    }
    setEditLoading(true);
    try {
      await editarProducto(editId, {
        ...editForm,
        precio: Number(editForm.precio),
        stock_actual: Number(editForm.stock_actual),
        stock_minimo: Number(editForm.stock_minimo),
        valor_medida: Number(editForm.valor_medida),
      });
      setEditOpen(false);
      cargar();
    } catch (err) {
      setEditError(err?.response?.data?.error || "Error al guardar.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await eliminarProducto(deleteId);
      setDeleteId(null);
      cargar();
    } catch {
      setError("Error al eliminar el producto.");
      setDeleteId(null);
    }
  };

  const stockChip = (p) => {
    if (p.stock_actual === 0) return <Chip label="Sin stock" color="error" size="small" />;
    if (p.stock_actual <= p.stock_minimo) return <Chip icon={<WarningAmberIcon />} label={p.stock_actual} color="warning" size="small" />;
    return <Chip label={p.stock_actual} color="success" size="small" />;
  };

  const cellSx = { color: "#f9fafb", borderBottom: "1px solid #374151" };
  const headSx = { color: "#9ca3af", fontWeight: 700, borderBottom: "1px solid #374151" };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0f0f0f" }}>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin-stock")} sx={{ color: "#9ca3af" }}>
              Volver
            </Button>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>Productos</Typography>
          </Stack>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/admin-stock-upload")}
            sx={{ bgcolor: "#22c55e", ":hover": { bgcolor: "#16a34a" } }}>
            Nuevo
          </Button>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TableContainer component={Paper} sx={{ backgroundColor: "#1a1a1a", borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {["Nombre", "Categoría", "Precio", "Medida", "Stock", "Acciones"].map((h) => (
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
                : productos.map((p) => (
                    <TableRow key={p.id_producto} sx={{ ":hover": { backgroundColor: "#252525" } }}>
                      <TableCell sx={cellSx}>{p.nombre}</TableCell>
                      <TableCell sx={{ ...cellSx, color: "#9ca3af" }}>{p.categoria ?? "-"}</TableCell>
                      <TableCell sx={cellSx}>${Number(p.precio).toFixed(2)}</TableCell>
                      <TableCell sx={{ ...cellSx, color: "#9ca3af" }}>
                        {p.valor_medida} {p.tipo_unidad}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #374151" }}>{stockChip(p)}</TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #374151" }}>
                        <IconButton onClick={() => handleEditOpen(p)} sx={{ color: "#60a5fa" }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => setDeleteId(p.id_producto)} sx={{ color: "#f87171" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

              {!loading && productos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: "#9ca3af", py: 4, borderBottom: "none" }}>
                    No hay productos cargados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Modal Edición */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#1a1a1a", color: "#fff" }}>Editar Producto</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#1a1a1a" }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {editError && <Alert severity="error">{editError}</Alert>}

            <TextField label="Nombre *" value={editForm.nombre}
              onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
              fullWidth InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />

            <TextField label="Descripción" value={editForm.descripcion} multiline rows={2}
              onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
              fullWidth InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />

            <Stack direction="row" spacing={2}>
              <TextField select label="Categoría *" value={editForm.categoria}
                onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
                fullWidth InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx}>
                {CATEGORIAS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField label="Precio *" type="number" value={editForm.precio}
                onChange={(e) => setEditForm({ ...editForm, precio: e.target.value })}
                fullWidth inputProps={{ min: 0, step: "0.01" }}
                InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField select label="Tipo de unidad *" value={editForm.tipo_unidad}
                onChange={(e) => setEditForm({ ...editForm, tipo_unidad: e.target.value })}
                fullWidth InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx}>
                {UNIDADES.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
              </TextField>
              <TextField label="Valor / medida *" type="number" value={editForm.valor_medida}
                onChange={(e) => setEditForm({ ...editForm, valor_medida: e.target.value })}
                fullWidth inputProps={{ min: 0, step: "0.01" }}
                InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField label="Stock actual *" type="number" value={editForm.stock_actual}
                onChange={(e) => setEditForm({ ...editForm, stock_actual: e.target.value })}
                fullWidth inputProps={{ min: 0 }}
                InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />
              <TextField label="Stock mínimo" type="number" value={editForm.stock_minimo}
                onChange={(e) => setEditForm({ ...editForm, stock_minimo: e.target.value })}
                fullWidth inputProps={{ min: 0 }}
                InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />
            </Stack>

            <TextField label="URL de imagen" value={editForm.imagen_url}
              onChange={(e) => setEditForm({ ...editForm, imagen_url: e.target.value })}
              fullWidth InputLabelProps={{ style: { color: "#9ca3af" } }} InputProps={{ style: { color: "#fff" } }} sx={fieldSx} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#1a1a1a", px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: "#9ca3af" }}>Cancelar</Button>
          <Button onClick={handleEditSave} disabled={editLoading} variant="contained"
            sx={{ bgcolor: "#22c55e", ":hover": { bgcolor: "#16a34a" } }}>
            {editLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Eliminación */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ backgroundColor: "#1a1a1a", color: "#fff" }}>¿Eliminar producto?</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#1a1a1a" }}>
          <Typography sx={{ color: "#9ca3af" }}>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#1a1a1a", px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: "#9ca3af" }}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained"
            sx={{ bgcolor: "#ef4444", ":hover": { bgcolor: "#b91c1c" } }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
