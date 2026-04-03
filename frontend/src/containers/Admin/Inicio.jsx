import { Box, Container, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar.jsx";

const items = [
  {
    label: "Stock",
    icon: <Inventory2OutlinedIcon sx={{ fontSize: 50 }} />,
    route: "/admin-stock",
    available: true,
  },
  {
    label: "Ventas",
    icon: <PointOfSaleOutlinedIcon sx={{ fontSize: 50 }} />,
    route: "/admin-ventas",
    available: false,
  },
  {
    label: "Ecommerce",
    icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 50 }} />,
    route: "/ecommerce",
    available: false,
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0f0f0f" }}>
      <AdminNavbar />

      {/* Cards */}
      <Box sx={{ py: 3, px: 4 }}>
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
          Panel de Control
        </Typography>
        <Typography variant="body2" sx={{ color: "#9ca3af", mt: 0.5 }}>
          Seleccioná un módulo para comenzar.
        </Typography>
      </Box>

      <Container sx={{ mt: 1 }}>
        <Grid container spacing={4} justifyContent="center">
          {items.map(({ label, icon, route, available }) => (
            <Grid item key={label}>
              <Box sx={{ textAlign: "center" }}>
                <Paper
                  elevation={available ? 3 : 0}
                  sx={{
                    p: 4,
                    width: 140,
                    height: 140,
                    borderRadius: 4,
                    backgroundColor: available ? "#dcdcdc" : "#2a2a2a",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    cursor: available ? "pointer" : "default",
                    transition: "transform 0.2s",
                    opacity: available ? 1 : 0.45,
                    ":hover": available ? { transform: "scale(1.05)" } : {},
                  }}
                  onClick={() => available && navigate(route)}
                >
                  <IconButton color="inherit" disableRipple sx={{ mb: 1 }}>
                    {icon}
                  </IconButton>
                  <Typography variant="body2" color={available ? "#333" : "#888"}>
                    {label}
                  </Typography>
                </Paper>
                {!available && (
                  <Typography variant="caption" sx={{ color: "#6b7280", mt: 0.5, display: "block" }}>
                    Próximamente
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
