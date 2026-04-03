import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const agregar = (producto, cantidad = 1) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.id_producto === producto.id_producto);
      if (existe) {
        return prev.map((i) =>
          i.id_producto === producto.id_producto
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const quitar = (id_producto) => {
    setItems((prev) => prev.filter((i) => i.id_producto !== id_producto));
  };

  const cambiarCantidad = (id_producto, cantidad) => {
    if (cantidad < 1) return quitar(id_producto);
    setItems((prev) =>
      prev.map((i) => (i.id_producto === id_producto ? { ...i, cantidad } : i))
    );
  };

  const vaciar = () => setItems([]);

  const total = items.reduce((acc, i) => acc + Number(i.precio) * i.cantidad, 0);
  const cantidad = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, agregar, quitar, cambiarCantidad, vaciar, total, cantidad }}>
      {children}
    </CartContext.Provider>
  );
}
