import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./database/connection.js";

/* IMPORTACIONES DE RUTAS */
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);

// --- NUEVO: MANEJADOR DE ERRORES GLOBAL ---
app.use((err, req, res, next) => {
  // Log detallado en la consola del servidor
  console.error("=== ❌ ERROR DETECTADO ===");
  console.error(`Fecha: ${new Date().toLocaleString()}`);
  console.error(`Ruta: ${req.method} ${req.url}`);
  console.error(`Mensaje: ${err.message}`);
  console.error("Stack Trace:");
  console.error(err.stack); // Esto te dice exactamente en qué línea falló
  console.error("===========================");

  // Respuesta al cliente (frontend)
  res.status(err.status || 500).json({
    error: "Error interno del servidor",
    message: err.message
  });
});
// ------------------------------------------

async function testDB() {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ DB funcionando");
  } catch (error) {
    console.error("❌ Error DB:", error);
  }
}

testDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});