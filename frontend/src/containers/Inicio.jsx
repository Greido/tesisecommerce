import { Box, Container, Grid, Typography, Button, Card, CardContent, CardMedia } from "@mui/material";
import Navbar from "./Navbar"

export default function Home() {
  return (
    <>

    <Navbar/>

    <Box sx={{ backgroundColor: "#0f0f0f", minHeight: "100vh", color: "white" }}>
      
      {/* HERO */}
      <Box
        sx={{
          height: 400,
          background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1601758064226-9d1f3c7f09c3')",
          backgroundSize: "cover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Todo para tu mascota 🐾
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Productos de calidad para perros y gatos
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3, backgroundColor: "#00c853" }}
          >
            Ver Productos
          </Button>
        </Box>
      </Box>

      {/* PRODUCTOS DESTACADOS */}
      <Container sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Productos Destacados
        </Typography>

        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card sx={{ backgroundColor: "#1c1c1c", color: "white" }}>
                <CardMedia
                  component="img"
                  height="180"
                  image="https://images.unsplash.com/photo-1583337130417-3346a1be7dee"
                />
                <CardContent>
                  <Typography variant="h6">
                    Alimento Premium
                  </Typography>
                  <Typography sx={{ color: "#00e676", mt: 1 }}>
                    $12.000
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: "#00c853" }}
                  >
                    Agregar al carrito
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

    </Box>
    </>
  );
}