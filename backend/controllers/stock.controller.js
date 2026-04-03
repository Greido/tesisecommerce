import { db } from "../database/connection.js";

// GET /api/stock
export const getProductos = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM productos ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// GET /api/stock/:id
export const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM productos WHERE id_producto = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener producto:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// POST /api/stock
export const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock_actual, stock_minimo, categoria, tipo_unidad, valor_medida, imagen_url } = req.body;

  if (!nombre || precio == null || stock_actual == null || !categoria || !tipo_unidad || valor_medida == null) {
    return res.status(400).json({ error: "nombre, precio, stock, categoría, tipo de unidad y valor son obligatorios" });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO productos (nombre, descripcion, precio, stock_actual, stock_minimo, categoria, tipo_unidad, valor_medida, imagen_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion ?? null, precio, stock_actual, stock_minimo ?? 5, categoria, tipo_unidad, valor_medida, imagen_url ?? null]
    );
    res.status(201).json({ message: "Producto creado", id_producto: result.insertId });
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// PUT /api/stock/:id
export const editarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock_actual, stock_minimo, categoria, tipo_unidad, valor_medida, imagen_url } = req.body;

  if (!nombre || precio == null || stock_actual == null || !categoria || !tipo_unidad || valor_medida == null) {
    return res.status(400).json({ error: "nombre, precio, stock, categoría, tipo de unidad y valor son obligatorios" });
  }

  try {
    const [result] = await db.execute(
      `UPDATE productos SET nombre=?, descripcion=?, precio=?, stock_actual=?, stock_minimo=?, categoria=?, tipo_unidad=?, valor_medida=?, imagen_url=?
       WHERE id_producto=?`,
      [nombre, descripcion ?? null, precio, stock_actual, stock_minimo ?? 5, categoria, tipo_unidad, valor_medida, imagen_url ?? null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto actualizado" });
  } catch (err) {
    console.error("Error al editar producto:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// DELETE /api/stock/:id
export const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      "DELETE FROM productos WHERE id_producto = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
