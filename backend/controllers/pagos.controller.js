import { MercadoPagoConfig, Preference } from "mercadopago";
import { db } from "../database/connection.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// POST /api/pagos/crear-preferencia
export const crearPreferencia = async (req, res) => {
  const { items, direccion, observaciones } = req.body;
  const id_usuario = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío" });
  }

  try {
    // Traer datos del usuario para el payer
    const [rows] = await db.execute(
      "SELECT nombre, email FROM users WHERE id_usuario = ?",
      [id_usuario]
    );
    const usuario = rows[0];

    const preference = new Preference(client);

    const body = {
      items: items.map((item) => ({
        id: String(item.id_producto),
        title: item.nombre,
        quantity: Number(item.cantidad),
        unit_price: Number(item.precio),
        currency_id: "ARS",
      })),
      payer: {
        name: usuario?.nombre ?? "Cliente",
        email: usuario?.email ?? "test@test.com",
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL || "http://localhost:5173"}/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout`,
        pending: `${process.env.FRONTEND_URL || "http://localhost:5173"}/pago-pendiente`,
      },
      external_reference: JSON.stringify({ id_usuario, direccion, observaciones }),
      statement_descriptor: "AnimalZoo",
    };

    const response = await preference.create({ body });

    res.json({
      preference_id: response.id,
      sandbox_init_point: response.sandbox_init_point,
      init_point: response.init_point,
    });
  } catch (err) {
    console.error("Error al crear preferencia MP:", err);
    res.status(500).json({ error: "Error al conectar con MercadoPago" });
  }
};

// POST /api/pagos/webhook  — MP notifica el resultado del pago
export const webhook = async (req, res) => {
  const { type, data } = req.body;

  if (type !== "payment") return res.sendStatus(200);

  try {
    const { Payment } = await import("mercadopago");
    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: data.id });

    if (payment.status !== "approved") return res.sendStatus(200);

    // Recuperar datos del external_reference
    let ref;
    try { ref = JSON.parse(payment.external_reference); } catch { return res.sendStatus(200); }

    const { id_usuario, direccion, observaciones } = ref;
    const items = payment.additional_info?.items ?? [];

    if (!items.length) return res.sendStatus(200);

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const total = payment.transaction_amount;

      const [pedido] = await conn.execute(
        "INSERT INTO pedidos (id_usuario, total, estado, direccion, observaciones) VALUES (?, ?, 'Confirmado', ?, ?)",
        [id_usuario, total, direccion ?? null, observaciones ?? null]
      );
      const id_pedido = pedido.insertId;

      for (const item of items) {
        await conn.execute(
          "INSERT INTO pedido_items (id_pedido, id_producto, nombre, precio, cantidad) VALUES (?, ?, ?, ?, ?)",
          [id_pedido, item.id, item.title, item.unit_price, item.quantity]
        );
        await conn.execute(
          "UPDATE productos SET stock_actual = stock_actual - ? WHERE id_producto = ?",
          [item.quantity, item.id]
        );
      }

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      console.error("Error procesando webhook:", e);
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Error en webhook MP:", err);
  }

  res.sendStatus(200);
};
