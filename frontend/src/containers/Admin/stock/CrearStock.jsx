import { Box, Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../components/AdminNavbar.jsx";

const items = [
  {
    label: "Cargar Producto",
    icon: <Inventory2OutlinedIcon sx={{ fontSize: 60 }} />,
    route: "/admin-stock-upload",
  },
  {
    label: "Ver Productos",
    icon: <ListAltOutlinedIcon sx={{ fontSize: 60 }} />,
    route: "/admin-stock-views",
  },
];

export default function StockMenu() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0f0f0f" }}>
      <AdminNavbar />
      <Box sx={{ py: 3, px: 4 }}>
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
          Stock
        </Typography>
        <Typography variant="body2" sx={{ color: "#9ca3af", mt: 0.5 }}>
          Gestioná tus productos
        </Typography>
      </Box>

      <Container sx={{ mt: 2 }}>
        <Grid container spacing={4} justifyContent="center">
          {items.map(({ label, icon, route }) => (
            <Grid item key={label}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  width: 140,
                  height: 140,
                  borderRadius: 4,
                  backgroundColor: "#dcdcdc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  ":hover": { transform: "scale(1.05)" },
                }}
                onClick={() => navigate(route)}
              >
                <IconButton color="inherit" disableRipple sx={{ mb: 1 }}>
                  {icon}
                </IconButton>
                <Typography variant="body2" color="#333">
                  {label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
