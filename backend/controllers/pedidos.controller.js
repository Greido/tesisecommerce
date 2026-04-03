import { db } from "../database/connection.js";

// POST /api/pedidos  — crear pedido desde el carrito
export const crearPedido = async (req, res) => {
  const { items, direccion, observaciones } = req.body;
  const id_usuario = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Verificar stock y calcular total
    let total = 0;
    for (const item of items) {
      const [rows] = await conn.execute(
        "SELECT stock_actual, precio FROM productos WHERE id_producto = ?",
        [item.id_producto]
      );
      if (rows.length === 0) throw new Error(`Producto ${item.id_producto} no encontrado`);
      if (rows[0].stock_actual < item.cantidad) {
        throw new Error(`Stock insuficiente para "${item.nombre}"`);
      }
      total += Number(rows[0].precio) * item.cantidad;
    }

    // Insertar pedido
    const [pedido] = await conn.execute(
      "INSERT INTO pedidos (id_usuario, total, direccion, observaciones) VALUES (?, ?, ?, ?)",
      [id_usuario, total.toFixed(2), direccion ?? null, observaciones ?? null]
    );
    const id_pedido = pedido.insertId;

    // Insertar items y descontar stock
    for (const item of items) {
      await conn.execute(
        "INSERT INTO pedido_items (id_pedido, id_producto, nombre, precio, cantidad) VALUES (?, ?, ?, ?, ?)",
        [id_pedido, item.id_producto, item.nombre, item.precio, item.cantidad]
      );
      await conn.execute(
        "UPDATE productos SET stock_actual = stock_actual - ? WHERE id_producto = ?",
        [item.cantidad, item.id_producto]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Pedido creado", id_pedido, total });
  } catch (err) {
    await conn.rollback();
    console.error("Error al crear pedido:", err);
    res.status(400).json({ error: err.message || "Error al crear el pedido" });
  } finally {
    conn.release();
  }
};

// GET /api/pedidos/mis-pedidos  — historial del usuario
export const getMisPedidos = async (req, res) => {
  const id_usuario = req.user.id;
  try {
    const [pedidos] = await db.execute(
      "SELECT * FROM pedidos WHERE id_usuario = ? ORDER BY created_at DESC",
      [id_usuario]
    );
    for (const p of pedidos) {
      const [items] = await db.execute(
        "SELECT * FROM pedido_items WHERE id_pedido = ?",
        [p.id_pedido]
      );
      p.items = items;
    }
    res.json(pedidos);
  } catch (err) {
    console.error("Error al obtener pedidos:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// GET /api/pedidos  — todos los pedidos (admin)
export const getAllPedidos = async (req, res) => {
  try {
    const [pedidos] = await db.execute(
      `SELECT p.*, u.nombre AS cliente, u.email
       FROM pedidos p
       JOIN users u ON p.id_usuario = u.id_usuario
       ORDER BY p.created_at DESC`
    );
    for (const p of pedidos) {
      const [items] = await db.execute(
        "SELECT * FROM pedido_items WHERE id_pedido = ?",
        [p.id_pedido]
      );
      p.items = items;
    }
    res.json(pedidos);
  } catch (err) {
    console.error("Error al obtener pedidos:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// PUT /api/pedidos/:id/estado  — actualizar estado (admin)
export const updateEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const ESTADOS = ["Pendiente", "Confirmado", "Enviado", "Completado", "Cancelado"];
  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  try {
    await db.execute("UPDATE pedidos SET estado = ? WHERE id_pedido = ?", [estado, id]);
    res.json({ message: "Estado actualizado" });
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
