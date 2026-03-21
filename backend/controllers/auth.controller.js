import { db } from "../database/connection.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user.id_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


// REGISTER
export const register = async (req, res) => {
  const {
    nombre,
    email,
    password,
    telefono,
    direccion,
    ciudad,
    codigoPostal
  } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO users 
      (nombre, email, password, telefono, direccion, ciudad, codigoPostal, rol) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, email, hashedPassword, telefono, direccion, ciudad, codigoPostal, 0]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      userId: result.insertId,
      rol: 0
    });

  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};