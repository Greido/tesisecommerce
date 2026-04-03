import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Divider
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Pets } from "@mui/icons-material";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedUser = await login({ email, password });
      if (!loggedUser) {
        throw new Error("Credenciales inválidas");
      }

      // Redirigir según el ROL
      if (Number(loggedUser.rol) === 1) {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
        backgroundColor: "#000",
        margin: 0,
        padding: 0
      }}
    >
      {/* Panel izquierdo con gradiente - Solo visible en desktop */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: { md: "50%", lg: "55%" },
          height: "100%",
          background: "linear-gradient(135deg, #1e4a1e 0%, #2d6b2d 50%, #3d8a3d 100%)",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }
        }}
      >
        <Box
          sx={{
            zIndex: 1,
            textAlign: "center",
            color: "white",
            px: 4
          }}
        >
          <Pets
            sx={{
              fontSize: { md: 120, lg: 150 },
              mb: 3,
              opacity: 0.9,
              filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))"
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { md: "2.5rem", lg: "3rem" },
              textShadow: "0 2px 10px rgba(0,0,0,0.3)"
            }}
          >
            Bienvenido a AnimalZoo
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              fontWeight: 300,
              fontSize: { md: "1.1rem", lg: "1.25rem" }
            }}
          >
            Gestiona y disfruta de tu zoológico virtual
          </Typography>
        </Box>
      </Box>

      {/* Panel derecho con formulario */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%", lg: "45%" },
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 3, sm: 4, md: 6 },
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflowY: "auto"
        }}
      >
        {/* Patrón de fondo sutil */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
            backgroundSize: "40px 40px",
            opacity: 0.5
          }}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "450px", md: "420px", lg: "480px" },
            zIndex: 1,
            position: "relative"
          }}
        >
          {/* Logo en móvil */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "center",
              mb: 4
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "20px",
                background: "linear-gradient(135deg, #1e4a1e 0%, #2d6b2d 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(30, 74, 30, 0.4)"
              }}
            >
              <Pets sx={{ fontSize: 40, color: "white" }} />
            </Box>
          </Box>

          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" }
            }}
          >
            Iniciar Sesión
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#888",
              mb: { xs: 3, md: 4 },
              fontSize: { xs: "0.9rem", sm: "1rem" }
            }}
          >
            Ingresa tus credenciales para continuar
          </Typography>

          <Box component="form" sx={{ width: "100%" }} onSubmit={handleLogin}>
            <TextField
              fullWidth
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#111",
                  borderRadius: 2,
                  color: "#fff",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  height: { xs: "56px", md: "60px" },
                  "& fieldset": {
                    borderColor: "#222",
                    borderWidth: "1.5px"
                  },
                  "&:hover fieldset": {
                    borderColor: "#2d6b2d"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2d6b2d",
                    borderWidth: "2px"
                  }
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#555",
                  opacity: 1
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#666", fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#111",
                  borderRadius: 2,
                  color: "#fff",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  height: { xs: "56px", md: "60px" },
                  "& fieldset": {
                    borderColor: "#222",
                    borderWidth: "1.5px"
                  },
                  "&:hover fieldset": {
                    borderColor: "#2d6b2d"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2d6b2d",
                    borderWidth: "2px"
                  }
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#555",
                  opacity: 1
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#666", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      sx={{ color: "#666" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                py: { xs: 1.5, md: 1.75 },
                mb: 3,
                fontSize: { xs: "0.95rem", sm: "1rem" },
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                background: "linear-gradient(135deg, #1e4a1e 0%, #2d6b2d 100%)",
                boxShadow: "0 4px 20px rgba(30, 74, 30, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #2d6b2d 0%, #3d8a3d 100%)",
                  boxShadow: "0 6px 30px rgba(45, 107, 45, 0.5)",
                  transform: "translateY(-2px)"
                },
                "&:active": {
                  transform: "translateY(0)"
                }
              }}
            >
              Iniciar Sesión
            </Button>

            <Divider sx={{ my: 3, borderColor: "#222" }}>
              <Typography variant="body2" sx={{ color: "#666", px: 2 }}>
                o
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#888",
                  fontSize: { xs: "0.85rem", sm: "0.9rem" }
                }}
              >
                ¿No tienes una cuenta?{" "}
                <Typography
                  component="span"
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "#2d6b2d",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": {
                      color: "#3d8a3d",
                      textDecoration: "underline"
                    },
                    transition: "color 0.2s ease"
                  }}
                >
                  Regístrate aquí
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
