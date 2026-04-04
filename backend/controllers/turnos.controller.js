import { db } from "../database/connection.js";

const ESTADOS = ["Pendiente", "Confirmado", "Cancelado", "Completado"];

// POST /api/turnos  — crear turno (usuario autenticado)
export const crearTurno = async (req, res) => {
  const { nombre_mascota, especie_mascota, servicio, fecha_hora, observaciones } = req.body;
  const id_usuario = req.user.id;

  if (!nombre_mascota || !servicio || !fecha_hora) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const fecha = new Date(fecha_hora);
  if (isNaN(fecha.getTime()) || fecha <= new Date()) {
    return res.status(400).json({ error: "La fecha debe ser futura y válida" });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO turnos (id_usuario, nombre_mascota, especie_mascota, servicio, fecha_hora, observaciones)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_usuario, nombre_mascota, especie_mascota ?? "Perro", servicio, fecha_hora, observaciones ?? null]
    );
    res.status(201).json({ message: "Turno solicitado", id_turno: result.insertId });
  } catch (err) {
    console.error("Error al crear turno:", err);
    res.status(500).json({ error: "Error al crear el turno" });
  }
};

// GET /api/turnos/mis-turnos  — turnos del usuario autenticado
export const getMisTurnos = async (req, res) => {
  const id_usuario = req.user.id;
  try {
    const [turnos] = await db.execute(
      "SELECT * FROM turnos WHERE id_usuario = ? ORDER BY fecha_hora ASC",
      [id_usuario]
    );
    res.json(turnos);
  } catch (err) {
    console.error("Error al obtener turnos:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// DELETE /api/turnos/:id  — cancelar turno propio (solo si está Pendiente)
export const cancelarTurno = async (req, res) => {
  const { id } = req.params;
  const id_usuario = req.user.id;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM turnos WHERE id_turno = ? AND id_usuario = ?",
      [id, id_usuario]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Turno no encontrado" });
    if (rows[0].estado !== "Pendiente") {
      return res.status(400).json({ error: "Solo podés cancelar turnos pendientes" });
    }
    await db.execute("UPDATE turnos SET estado = 'Cancelado' WHERE id_turno = ?", [id]);
    res.json({ message: "Turno cancelado" });
  } catch (err) {
    console.error("Error al cancelar turno:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// GET /api/turnos  — todos los turnos (admin)
export const getAllTurnos = async (req, res) => {
  try {
    const [turnos] = await db.execute(
      `SELECT t.*, u.nombre AS cliente, u.email
       FROM turnos t
       JOIN users u ON t.id_usuario = u.id_usuario
       ORDER BY t.fecha_hora ASC`
    );
    res.json(turnos);
  } catch (err) {
    console.error("Error al obtener turnos:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// PUT /api/turnos/:id/estado  — cambiar estado (admin)
export const updateEstadoTurno = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  try {
    const [result] = await db.execute(
      "UPDATE turnos SET estado = ? WHERE id_turno = ?",
      [estado, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Turno no encontrado" });
    res.json({ message: "Estado actualizado" });
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
