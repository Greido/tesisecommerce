import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton
} from "@mui/material";
import {
  Pets,
  ShoppingCart,
  People,
  Inventory2,
  ArrowUpward,
  ArrowDownward,
  MoreVert
} from "@mui/icons-material";

export default function Dashboard() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        backgroundColor: "#050805",
        color: "#f9fafb"
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          width: { sm: 80, md: 240 },
          borderRight: "1px solid rgba(45,107,45,0.3)",
          background:
            "linear-gradient(180deg, rgba(14,32,14,1) 0%, rgba(6,12,6,1) 100%)",
          p: { sm: 1.5, md: 2 },
          gap: 2
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={{ sm: "center", md: "flex-start" }}
          spacing={1.5}
          sx={{ mb: 3 }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background:
                "radial-gradient(circle at 30% 30%, #4ade80, #22c55e, #14532d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(34,197,94,0.35)"
            }}
          >
            <Pets sx={{ color: "#f9fafb", fontSize: 26 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              display: { sm: "none", md: "block" },
              fontWeight: 700,
              letterSpacing: 0.5
            }}
          >
            AnimalZoo
          </Typography>
        </Stack>

        <Stack
          spacing={1}
          sx={{ mt: 1, fontSize: 14, color: "#9ca3af", display: { sm: "none", md: "flex" } }}
        >
          <Typography sx={{ fontWeight: 600, color: "#9ca3af" }}>
            Principal
          </Typography>
          <Typography sx={{ color: "#e5e7eb" }}>Dashboard</Typography>
          <Typography>Pedidos</Typography>
          <Typography>Clientes</Typography>
          <Typography>Productos</Typography>
          <Typography>Ajustes</Typography>
        </Stack>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: { xs: 2, sm: 3, md: 4 },
          gap: 3
        }}
      >
        {/* Top bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap"
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 0.5, color: "#f9fafb" }}
            >
              Panel de control
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#9ca3af" }}
            >
              Resumen general de tu tienda online.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label="Hoy"
              sx={{
                borderRadius: 2,
                backgroundColor: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.6)",
                color: "#bbf7d0",
                fontWeight: 500
              }}
            />
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#14532d",
                fontSize: 16
              }}
            >
              AZ
            </Avatar>
          </Stack>
        </Box>

        {/* KPI cards */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                background:
                  "radial-gradient(circle at 0 0, rgba(34,197,94,0.18), #020617)",
                border: "1px solid rgba(34,197,94,0.5)"
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                    Ventas de hoy
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mt: 0.5, color: "#f9fafb" }}
                  >
                    $4.250,90
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }}>
                    <ArrowUpward sx={{ fontSize: 16, color: "#4ade80" }} />
                    <Typography variant="caption" sx={{ color: "#4ade80" }}>
                      +12% vs. ayer
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: "rgba(21,128,61,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ShoppingCart sx={{ color: "#bbf7d0" }} />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: "#020617",
                border: "1px solid rgba(55,65,81,0.7)"
              }}
            >
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Pedidos de hoy
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mt: 0.5, color: "#f9fafb" }}
              >
                37
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }}>
                <ArrowUpward sx={{ fontSize: 16, color: "#4ade80" }} />
                <Typography variant="caption" sx={{ color: "#4ade80" }}>
                  +5 nuevos
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: "#020617",
                border: "1px solid rgba(55,65,81,0.7)"
              }}
            >
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Clientes activos
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mt: 0.5, color: "#f9fafb" }}
              >
                1.248
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }}>
                <People sx={{ fontSize: 18, color: "#e5e7eb" }} />
                <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                  +32 hoy
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: "#020617",
                border: "1px solid rgba(55,65,81,0.7)"
              }}
            >
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                Stock bajo
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mt: 0.5, color: "#f9fafb" }}
              >
                12 productos
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }}>
                <Inventory2 sx={{ fontSize: 18, color: "#f97316" }} />
                <Typography variant="caption" sx={{ color: "#f97316" }}>
                  Reponer pronto
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Middle section: chart + recent orders */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: "#020617",
                border: "1px solid rgba(31,41,55,0.8)",
                height: "100%"
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1.5 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Ventas de la semana
                </Typography>
                <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                  Datos de ejemplo
                </Typography>
              </Stack>
              {/* Placeholder de gráfico */}
              <Box
                sx={{
                  mt: 1,
                  height: 220,
                  borderRadius: 2,
                  background:
                    "repeating-linear-gradient(90deg, rgba(31,41,55,0.6) 0, rgba(31,41,55,0.6) 1px, transparent 1px, transparent 16px)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 16,
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1
                  }}
                >
                  {[40, 65, 50, 80, 55, 90, 70].map((value, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        borderRadius: 999,
                        background:
                          "linear-gradient(180deg, #22c55e 0%, #15803d 100%)",
                        height: `${value}%`,
                        opacity: 0.9
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: "#020617",
                border: "1px solid rgba(31,41,55,0.8)",
                height: "100%",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Últimos pedidos
                </Typography>
                <IconButton size="small" sx={{ color: "#9ca3af" }}>
                  <MoreVert fontSize="small" />
                </IconButton>
              </Stack>

              <List dense sx={{ mt: 1, flex: 1, overflow: "auto" }}>
                {[
                  {
                    id: "#A-1024",
                    cliente: "Juan Pérez",
                    total: "$89,90",
                    estado: "Pagado"
                  },
                  {
                    id: "#A-1023",
                    cliente: "María Gómez",
                    total: "$149,50",
                    estado: "En preparación"
                  },
                  {
                    id: "#A-1022",
                    cliente: "Carlos López",
                    total: "$39,99",
                    estado: "Enviado"
                  },
                  {
                    id: "#A-1021",
                    cliente: "Ana Rodríguez",
                    total: "$249,00",
                    estado: "Pagado"
                  }
                ].map((order, index) => (
                  <React.Fragment key={order.id}>
                    <ListItem
                      secondaryAction={
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#e5e7eb" }}
                        >
                          {order.total}
                        </Typography>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: "#14532d",
                            width: 32,
                            height: 32,
                            fontSize: 13
                          }}
                        >
                          {order.cliente[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{ color: "#f9fafb", fontWeight: 500 }}
                          >
                            {order.id} · {order.cliente}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            sx={{ color: "#9ca3af" }}
                          >
                            {order.estado}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < 3 && (
                      <Divider
                        component="li"
                        sx={{ borderColor: "rgba(31,41,55,0.8)" }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick actions */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: "#020617",
                border: "1px solid rgba(31,41,55,0.8)"
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                Accesos rápidos
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ mt: 0.5 }}
              >
                <Chip
                  label="Crear producto"
                  icon={<Inventory2 sx={{ fontSize: 18 }} />}
                  sx={{
                    bgcolor: "rgba(34,197,94,0.12)",
                    borderRadius: 999,
                    color: "#bbf7d0"
                  }}
                />
                <Chip
                  label="Ver pedidos"
                  icon={<ShoppingCart sx={{ fontSize: 18 }} />}
                  sx={{
                    bgcolor: "rgba(15,23,42,0.8)",
                    borderRadius: 999,
                    color: "#e5e7eb"
                  }}
                />
                <Chip
                  label="Gestión de clientes"
                  icon={<People sx={{ fontSize: 18 }} />}
                  sx={{
                    bgcolor: "rgba(15,23,42,0.8)",
                    borderRadius: 999,
                    color: "#e5e7eb"
                  }}
                />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: "#020617",
                border: "1px solid rgba(31,41,55,0.8)"
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                Productos destacados
              </Typography>
              <Stack spacing={1.5}>
                {["Alimento premium perro", "Juguete interactivo gato", "Cama ortopédica"].map(
                  (name, index) => (
                    <Stack
                      key={name}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        bgcolor: "rgba(15,23,42,0.9)"
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#e5e7eb" }}>
                        {name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: index === 2 ? "#f97316" : "#4ade80",
                          fontWeight: 500
                        }}
                      >
                        {index === 2 ? "Stock bajo" : "Top ventas"}
                      </Typography>
                    </Stack>
                  )
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

