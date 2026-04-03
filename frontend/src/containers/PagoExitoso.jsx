import { Box, Button, Stack, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "../auth/CartContext.jsx";

export default function PagoExitoso() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { vaciar } = useCart();
  const pedidoId = params.get("external_reference");

  useEffect(() => {
    vaciar();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#050805", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Stack alignItems="center" spacing={3} sx={{ textAlign: "center", px: 4 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#22c55e" }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#f9fafb" }}>
          ¡Pago aprobado!
        </Typography>
        <Typography sx={{ color: "#9ca3af" }}>
          Tu pago fue procesado correctamente por MercadoPago.<br />
          Recibirás un correo con los detalles del pedido.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/dashboard")}
          sx={{ bgcolor: "#22c55e", fontWeight: 700, px: 4, ":hover": { bgcolor: "#16a34a" } }}>
          Volver a la tienda
        </Button>
      </Stack>
    </Box>
  );
}
