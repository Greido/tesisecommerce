import jwt from "jsonwebtoken";

export const validarJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos del token en la petición
    req.user = {
      id: decoded.id,
      rol: decoded.rol, 
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};