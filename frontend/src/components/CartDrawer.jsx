import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../auth/CartContext.jsx";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
  const { items, quitar, cambiarCantidad, total, vaciar } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 420 },
          backgroundColor: "#0f0f0f",
          color: "#f9fafb",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2, borderBottom: "1px solid #374151" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ShoppingCartOutlinedIcon sx={{ color: "#22c55e" }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Carrito
          </Typography>
          {items.length > 0 && (
            <Box sx={{ bgcolor: "#22c55e", color: "#fff", borderRadius: 999, px: 1, fontSize: 12, fontWeight: 700 }}>
              {items.reduce((a, i) => a + i.cantidad, 0)}
            </Box>
          )}
        </Stack>
        <IconButton onClick={onClose} sx={{ color: "#9ca3af" }}>
          <CloseIcon />
        </IconButton>
      </Stack>

      {/* Items */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
        {items.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", gap: 2, py: 8 }}>
            <ShoppingCartOutlinedIcon sx={{ fontSize: 64, color: "#374151" }} />
            <Typography sx={{ color: "#9ca3af" }}>Tu carrito está vacío</Typography>
          </Stack>
        ) : (
          <Stack spacing={2}>
            {items.map((item) => (
              <Box key={item.id_producto}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Imagen o placeholder */}
                  <Box
                    sx={{
                      width: 64, height: 64, borderRadius: 2, flexShrink: 0,
                      overflow: "hidden", backgroundColor: "#1a2e1a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {item.imagen_url
                      ? <Box component="img" src={item.imagen_url} alt={item.nombre} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <ShoppingCartOutlinedIcon sx={{ color: "#374151" }} />
                    }
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#f9fafb", noWrap: true }}>
                      {item.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#4ade80" }}>
                      ${Number(item.precio).toFixed(2)} c/u
                    </Typography>

                    {/* Cantidad */}
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.75 }}>
                      <IconButton size="small" onClick={() => cambiarCantidad(item.id_producto, item.cantidad - 1)}
                        sx={{ color: "#9ca3af", bgcolor: "#1a1a1a", width: 24, height: 24 }}>
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Typography variant="body2" sx={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>
                        {item.cantidad}
                      </Typography>
                      <IconButton size="small" onClick={() => cambiarCantidad(item.id_producto, item.cantidad + 1)}
                        sx={{ color: "#9ca3af", bgcolor: "#1a1a1a", width: 24, height: 24 }}>
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                  </Box>

                  {/* Subtotal + eliminar */}
                  <Stack alignItems="flex-end" spacing={0.5}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#22c55e" }}>
                      ${(Number(item.precio) * item.cantidad).toFixed(2)}
                    </Typography>
                    <IconButton size="small" onClick={() => quitar(item.id_producto)} sx={{ color: "#f87171" }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
                <Divider sx={{ borderColor: "#1f2937", mt: 2 }} />
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {/* Footer */}
      {items.length > 0 && (
        <Box sx={{ px: 3, py: 2.5, borderTop: "1px solid #374151" }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography sx={{ color: "#9ca3af" }}>Total</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#22c55e" }}>
              ${total.toFixed(2)}
            </Typography>
          </Stack>
          <Button fullWidth variant="contained" onClick={handleCheckout}
            sx={{ bgcolor: "#22c55e", fontWeight: 700, py: 1.5, ":hover": { bgcolor: "#16a34a" } }}>
            Confirmar pedido
          </Button>
          <Button fullWidth onClick={vaciar}
            sx={{ mt: 1, color: "#9ca3af", fontSize: 12 }}>
            Vaciar carrito
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
