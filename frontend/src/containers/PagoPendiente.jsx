import { Box, Button, Stack, Typography } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useNavigate } from "react-router-dom";

export default function PagoPendiente() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#050805", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Stack alignItems="center" spacing={3} sx={{ textAlign: "center", px: 4 }}>
        <HourglassEmptyIcon sx={{ fontSize: 80, color: "#f59e0b" }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#f9fafb" }}>
          Pago pendiente
        </Typography>
        <Typography sx={{ color: "#9ca3af" }}>
          Tu pago está siendo procesado por MercadoPago.<br />
          Te notificaremos cuando se confirme.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/dashboard")}
          sx={{ bgcolor: "#22c55e", fontWeight: 700, px: 4, ":hover": { bgcolor: "#16a34a" } }}>
          Volver a la tienda
        </Button>
      </Stack>
    </Box>
  );
}
