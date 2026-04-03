import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert
} from "@mui/material";

const API = import.meta.env.VITE_URL_BACK || "http://localhost:4000";

export default function Register() {
  const navigate = useNavigate();
  
  // Estados para manejar la UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formValues, setFormValues] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: ""
  });

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
    if (error) setError(""); // Limpiar error al escribir
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    // Validación básica en el cliente
    if (formValues.password !== formValues.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API}/api/auth/register`, {
        nombre: formValues.nombre,
        email: formValues.email,
        password: formValues.password,
        telefono: formValues.telefono,
        direccion: formValues.direccion,
        ciudad: formValues.ciudad,
        codigoPostal: formValues.codigoPostal
      });

      if (response.status === 201 || response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      // Manejo de errores (ej: email duplicado)
      const mensajeError = err.response?.data?.message || "Error al conectar con el servidor";
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#050805",
        backgroundImage:
          "radial-gradient(circle at 0 0, rgba(61,138,61,0.22), transparent 55%), radial-gradient(circle at 100% 100%, rgba(30,74,30,0.4), transparent 55%)",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "auto",
        padding: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: { xs: 420, sm: 520, md: 640 },
          padding: { xs: 3, sm: 4, md: 5 },
          borderRadius: 4,
          backgroundColor: "rgba(10,10,10,0.96)",
          border: "1px solid rgba(45,107,45,0.45)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.8), 0 0 0 1px rgba(45,107,45,0.3)"
        }}
      >
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
          Crear cuenta
        </Typography>

        <Typography variant="body1" sx={{ color: "#9ca3af", mb: 3 }}>
          Completa el formulario para empezar en la veterinaria.
        </Typography>

        {/* Mostrar error si existe */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, backgroundColor: "#1a0505", color: "#ffb4ab" }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Campos de texto (igual que tu diseño original) */}
            <Grid item xs={12} sm={6}>
              <CustomTextField label="Nombre completo" value={formValues.nombre} onChange={handleChange("nombre")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField label="Correo electrónico" type="email" value={formValues.email} onChange={handleChange("email")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField label="Contraseña" type="password" value={formValues.password} onChange={handleChange("password")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField label="Repetir contraseña" type="password" value={formValues.confirmPassword} onChange={handleChange("confirmPassword")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField label="Teléfono" value={formValues.telefono} onChange={handleChange("telefono")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField label="Dirección" value={formValues.direccion} onChange={handleChange("direccion")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField label="Localidad" value={formValues.ciudad} onChange={handleChange("ciudad")} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField label="C.P." value={formValues.codigoPostal} onChange={handleChange("codigoPostal")} />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              disabled={loading}
              sx={{ borderColor: "#3d8a3d", color: "#e5e7eb", textTransform: "none" }}
            >
              Volver al login
            </Button>

            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                textTransform: "none",
                px: 4,
                background: "linear-gradient(135deg, #1e4a1e 0%, #2d6b2d 100%)",
                fontWeight: 600,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Crear cuenta"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

// Componente auxiliar para no repetir estilos en cada TextField
function CustomTextField({ label, ...props }) {
  return (
    <TextField
      fullWidth
      label={label}
      InputLabelProps={{ sx: { color: "#ffffff", "&.Mui-focused": { color: "#ffffff" } } }}
      sx={{
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#050805",
          borderRadius: 2,
          color: "#fff",
          "& fieldset": { borderColor: "#1f2933" },
          "&:hover fieldset": { borderColor: "#3d8a3d" },
          "&.Mui-focused fieldset": { borderColor: "#3d8a3d", borderWidth: 2 }
        }
      }}
      {...props}
    />
  );
}