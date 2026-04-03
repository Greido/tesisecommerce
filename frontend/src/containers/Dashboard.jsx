import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { AdminPanelSettings, Logout, Pets, ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../auth/CartContext.jsx";
import { fetchProductos } from "../api/stock.js";
import CartDrawer from "../components/CartDrawer.jsx";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// ─── Banners del hero carousel ───────────────────────────────────────────────
const BANNERS = [
  {
    titulo: "Todo para tu mascota",
    subtitulo: "Los mejores productos para perros, gatos y más.",
    bg: "linear-gradient(135deg, #0f2a0f 0%, #14532d 60%, #166534 100%)",
    emoji: "🐶",
  },
  {
    titulo: "Nuevos productos",
    subtitulo: "Descubrí las últimas novedades de nuestra tienda.",
    bg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
    emoji: "🐱",
  },
  {
    titulo: "Envíos a todo el país",
    subtitulo: "Pedí desde casa y recibilo en la puerta.",
    bg: "linear-gradient(135deg, #431407 0%, #7c2d12 60%, #c2410c 100%)",
    emoji: "🐦",
  },
];

// ─── Card de producto ─────────────────────────────────────────────────────────
function ProductoCard({ p }) {
  const { agregar } = useCart();
  const stockColor = p.stock_actual === 0 ? "error" : p.stock_actual <= p.stock_minimo ? "warning" : "success";

  return (
    <Box
      sx={{
        backgroundColor: "#0d1f0d",
        border: "1px solid rgba(34,197,94,0.2)",
        borderRadius: 3,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, border-color 0.2s",
        ":hover": { transform: "translateY(-4px)", borderColor: "rgba(34,197,94,0.5)" },
        userSelect: "none",
      }}
    >
      {p.imagen_url ? (
        <Box
          component="img"
          src={p.imagen_url}
          alt={p.nombre}
          sx={{ width: "100%", height: 160, objectFit: "cover" }}
        />
      ) : (
        <Box
          sx={{
            height: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f2a0f",
          }}
        >
          <Pets sx={{ fontSize: 56, color: "rgba(34,197,94,0.25)" }} />
        </Box>
      )}

      <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#f9fafb", lineHeight: 1.3 }}>
            {p.nombre}
          </Typography>
          <Chip label={p.stock_actual === 0 ? "Sin stock" : `${p.stock_actual}`} color={stockColor} size="small" />
        </Stack>

        {p.categoria && (
          <Typography variant="caption" sx={{ color: "#4ade80" }}>
            {p.categoria}
          </Typography>
        )}

        {p.descripcion && (
          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              flex: 1,
            }}
          >
            {p.descripcion}
          </Typography>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: "auto", pt: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#22c55e" }}>
            ${Number(p.precio).toFixed(2)}
          </Typography>
          <Button
            size="small"
            variant="contained"
            startIcon={<ShoppingCart sx={{ fontSize: 16 }} />}
            disabled={p.stock_actual === 0}
            onClick={() => agregar(p, 1)}
            sx={{
              bgcolor: "#22c55e",
              color: "#fff",
              fontSize: 12,
              py: 0.5,
              ":hover": { bgcolor: "#16a34a" },
              ":disabled": { bgcolor: "#374151", color: "#6b7280" },
            }}
          >
            Agregar
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const { cantidad } = useCart();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const isAdmin = Number(user?.rol) === 1;

  useEffect(() => {
    fetchProductos()
      .then(setProductos)
      .catch(() => setProductos([]))
      .finally(() => setLoading(false));
  }, []);

  // Productos agrupados por categoría
  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];
  const sinCategoria = productos.filter((p) => !p.categoria);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#050805", color: "#f9fafb" }}>

      {/* ── Navbar ── */}
      <Box
        sx={{
          px: 4,
          py: 2,
          borderBottom: "1px solid rgba(45,107,45,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(180deg, rgba(14,32,14,1) 0%, rgba(6,12,6,1) 100%)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: 2,
              background: "radial-gradient(circle at 30% 30%, #4ade80, #22c55e, #14532d)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Pets sx={{ color: "#f9fafb", fontSize: 22 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>AnimalZoo</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" sx={{ color: "#9ca3af", display: { xs: "none", sm: "block" } }}>
            Hola, <strong style={{ color: "#f9fafb" }}>{user?.nombre}</strong>
          </Typography>

          {/* Ícono carrito */}
          <Box sx={{ position: "relative", cursor: "pointer" }} onClick={() => setCartOpen(true)}>
            <ShoppingCart sx={{ color: "#9ca3af", fontSize: 26, ":hover": { color: "#22c55e" }, transition: "color 0.2s" }} />
            {cantidad > 0 && (
              <Box sx={{
                position: "absolute", top: -6, right: -6,
                bgcolor: "#22c55e", color: "#fff", borderRadius: 999,
                width: 18, height: 18, fontSize: 11, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {cantidad > 9 ? "9+" : cantidad}
              </Box>
            )}
          </Box>

          <Avatar
            sx={{ width: 32, height: 32, bgcolor: "#14532d", fontSize: 14, cursor: "pointer" }}
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            {user?.nombre?.[0]?.toUpperCase() ?? "U"}
          </Avatar>
        </Stack>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: { mt: 1, backgroundColor: "#1a1a1a", border: "1px solid #374151", borderRadius: 2, minWidth: 200 },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#f9fafb" }}>{user?.nombre}</Typography>
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>{user?.email}</Typography>
          </Box>
          <Divider sx={{ borderColor: "#374151" }} />
          {isAdmin && (
            <MenuItem
              onClick={() => { setMenuAnchor(null); navigate("/admin-dashboard"); }}
              sx={{ color: "#4ade80", gap: 1, py: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <AdminPanelSettings sx={{ color: "#4ade80", fontSize: 20 }} />
              </ListItemIcon>
              Modo administrador
            </MenuItem>
          )}
          <MenuItem
            onClick={() => { setMenuAnchor(null); setConfirmLogout(true); }}
            sx={{ color: "#f87171", gap: 1, py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <Logout sx={{ color: "#f87171", fontSize: 20 }} />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>

        <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)}>
          <DialogTitle sx={{ backgroundColor: "#1a1a1a", color: "#fff" }}>¿Cerrar sesión?</DialogTitle>
          <DialogContent sx={{ backgroundColor: "#1a1a1a" }}>
            <Typography sx={{ color: "#9ca3af" }}>¿Estás seguro que querés salir?</Typography>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#1a1a1a", px: 3, pb: 2 }}>
            <Button onClick={() => setConfirmLogout(false)} sx={{ color: "#9ca3af" }}>No</Button>
            <Button onClick={logout} variant="contained" sx={{ bgcolor: "#ef4444", ":hover": { bgcolor: "#b91c1c" } }}>
              Sí, salir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ── Hero carousel ── */}
      <Box sx={{ "& .swiper-pagination-bullet-active": { background: "#22c55e" } }}>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
        >
          {BANNERS.map((b, i) => (
            <SwiperSlide key={i}>
              <Box
                sx={{
                  background: b.bg,
                  height: { xs: 220, sm: 300, md: 380 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 2,
                  px: 4,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: { xs: 56, md: 80 } }}>{b.emoji}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#fff", fontSize: { xs: "1.6rem", md: "2.25rem" } }}>
                  {b.titulo}
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.75)", maxWidth: 500 }}>
                  {b.subtitulo}
                </Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: "#22c55e" }} />
        </Box>
      ) : productos.length === 0 ? (
        <Typography sx={{ color: "#9ca3af", textAlign: "center", mt: 8 }}>
          No hay productos disponibles por el momento.
        </Typography>
      ) : (
        <Box sx={{ px: { xs: 2, md: 4 }, py: 5 }}>

          {/* ── Carousel de todos los productos ── */}
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Productos destacados
          </Typography>

          <Box
            sx={{
              "& .swiper-button-next, & .swiper-button-prev": { color: "#22c55e" },
              mb: 6,
            }}
          >
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 3000, disableOnInteraction: true }}
              loop={productos.length > 4}
              spaceBetween={16}
              breakpoints={{
                0:   { slidesPerView: 1.2 },
                480: { slidesPerView: 2.2 },
                768: { slidesPerView: 3.2 },
                1024:{ slidesPerView: 4.2 },
              }}
            >
              {productos.map((p) => (
                <SwiperSlide key={p.id_producto}>
                  <ProductoCard p={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          {/* ── Secciones por categoría ── */}
          {categorias.map((cat) => {
            const prods = productos.filter((p) => p.categoria === cat);
            return (
              <Box key={cat} sx={{ mb: 6 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{cat}</Typography>
                  <Chip
                    label={`${prods.length} producto${prods.length !== 1 ? "s" : ""}`}
                    size="small"
                    sx={{ bgcolor: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }}
                  />
                </Stack>
                <Box sx={{ "& .swiper-button-next, & .swiper-button-prev": { color: "#22c55e" } }}>
                  <Swiper
                    modules={[Navigation]}
                    navigation
                    loop={prods.length > 4}
                    spaceBetween={16}
                    breakpoints={{
                      0:   { slidesPerView: 1.2 },
                      480: { slidesPerView: 2.2 },
                      768: { slidesPerView: 3.2 },
                      1024:{ slidesPerView: 4.2 },
                    }}
                  >
                    {prods.map((p) => (
                      <SwiperSlide key={p.id_producto}>
                        <ProductoCard p={p} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </Box>
            );
          })}

          {/* Productos sin categoría */}
          {sinCategoria.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Otros</Typography>
              <Box sx={{ "& .swiper-button-next, & .swiper-button-prev": { color: "#22c55e" } }}>
                <Swiper
                  modules={[Navigation]}
                  navigation
                  loop={sinCategoria.length > 4}
                  spaceBetween={16}
                  breakpoints={{
                    0:   { slidesPerView: 1.2 },
                    480: { slidesPerView: 2.2 },
                    768: { slidesPerView: 3.2 },
                    1024:{ slidesPerView: 4.2 },
                  }}
                >
                  {sinCategoria.map((p) => (
                    <SwiperSlide key={p.id_producto}>
                      <ProductoCard p={p} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            </Box>
          )}
        </Box>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  );
}
