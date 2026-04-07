import {
  Avatar,
  Box,
  Button,
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
import { Logout, Pets, StorefrontOutlined } from "@mui/icons-material";
import logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <>
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
        {/* Logo + breadcrumb */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            onClick={() => navigate("/admin-dashboard")}
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              cursor: "pointer", ":hover": { opacity: 0.8 },
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="AnimalZoo"
              sx={{ height: 36 }}
            />
          </Box>

          <Typography sx={{ color: "#374151" }}>/</Typography>

          <Typography
            variant="caption"
            sx={{
              bgcolor: "rgba(34,197,94,0.15)",
              border: "1px solid rgba(34,197,94,0.4)",
              color: "#4ade80",
              px: 1, py: 0.25, borderRadius: 1, fontWeight: 600,
            }}
          >
            Admin
          </Typography>
        </Stack>

        {/* Avatar */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" sx={{ color: "#9ca3af", display: { xs: "none", sm: "block" } }}>
            {user?.nombre}
          </Typography>
          <Avatar
            sx={{ width: 32, height: 32, bgcolor: "#14532d", fontSize: 14, cursor: "pointer" }}
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            {user?.nombre?.[0]?.toUpperCase() ?? "A"}
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
          <MenuItem
            onClick={() => { setMenuAnchor(null); navigate("/admin-dashboard"); }}
            sx={{ color: "#9ca3af", gap: 1, py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <Pets sx={{ color: "#9ca3af", fontSize: 20 }} />
            </ListItemIcon>
            Panel de control
          </MenuItem>
          <MenuItem
            onClick={() => { setMenuAnchor(null); navigate("/dashboard"); }}
            sx={{ color: "#9ca3af", gap: 1, py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <StorefrontOutlined sx={{ color: "#9ca3af", fontSize: 20 }} />
            </ListItemIcon>
            Ver tienda
          </MenuItem>
          <Divider sx={{ borderColor: "#374151" }} />
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
      </Box>

      <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <DialogTitle sx={{ backgroundColor: "#1a1a1a", color: "#fff" }}>¿Cerrar sesión?</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#1a1a1a" }}>
          <Typography sx={{ color: "#9ca3af" }}>¿Estás seguro que querés salir?</Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#1a1a1a", px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmLogout(false)} sx={{ color: "#9ca3af" }}>No</Button>
          <Button onClick={logout} variant="contained"
            sx={{ bgcolor: "#ef4444", ":hover": { bgcolor: "#b91c1c" } }}>
            Sí, salir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
