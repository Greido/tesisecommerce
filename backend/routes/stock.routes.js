import { Router } from "express";
import {
  getProductos,
  getProductoById,
  crearProducto,
  editarProducto,
  eliminarProducto,
} from "../controllers/stock.controller.js";
import { validarJwt, validarRol } from "../middlewares/auth.js";

const router = Router();

// Rutas públicas (cualquier usuario logueado puede ver productos)
router.get("/", validarJwt, getProductos);
router.get("/:id", validarJwt, getProductoById);

// Solo admin (rol = 1)
router.post("/", validarJwt, validarRol(1), crearProducto);
router.put("/:id", validarJwt, validarRol(1), editarProducto);
router.delete("/:id", validarJwt, validarRol(1), eliminarProducto);

export default router;
