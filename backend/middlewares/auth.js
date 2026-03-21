// middleware/auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";

// Middleware para verificar el token JWT
export const validarJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, rol, id_rol }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

// middleware/auth.js (continuación)

// Middleware para validar rol mínimo requerido
export const validarRol = (rolMinimo = 2) => {
    return (req, res, next) => {
      if (!req.user)
        return res.status(401).json({ error: "Usuario no autenticado" });
  
      if (req.user.id_rol < rolMinimo)
        return res.status(403).json({ error: "Acceso denegado" });
  
      next();
    };
  };