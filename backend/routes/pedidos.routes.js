import { Router } from "express";
import { crearPedido, getMisPedidos, getAllPedidos, updateEstado } from "../controllers/pedidos.controller.js";
import { validarJwt, validarRol } from "../middlewares/auth.js";

const router = Router();

router.post("/", validarJwt, crearPedido);
router.get("/mis-pedidos", validarJwt, getMisPedidos);
router.get("/", validarJwt, validarRol(1), getAllPedidos);
router.put("/:id/estado", validarJwt, validarRol(1), updateEstado);

export default router;
