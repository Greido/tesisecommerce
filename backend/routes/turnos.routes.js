import { Router } from "express";
import {
  crearTurno,
  getMisTurnos,
  cancelarTurno,
  getAllTurnos,
  updateEstadoTurno,
} from "../controllers/turnos.controller.js";
import { validarJwt, validarRol } from "../middlewares/auth.js";

const router = Router();

router.post("/", validarJwt, crearTurno);
router.get("/mis-turnos", validarJwt, getMisTurnos);
router.delete("/:id", validarJwt, cancelarTurno);
router.get("/", validarJwt, validarRol(1), getAllTurnos);
router.put("/:id/estado", validarJwt, validarRol(1), updateEstadoTurno);

export default router;
