import { Router } from "express";
import { crearPreferencia, webhook } from "../controllers/pagos.controller.js";
import { validarJwt } from "../middlewares/auth.js";

const router = Router();

router.post("/crear-preferencia", validarJwt, crearPreferencia);
router.post("/webhook", webhook); // MP no envía JWT, debe ser público

export default router;
