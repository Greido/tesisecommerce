-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id_usuario   INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  telefono     VARCHAR(20),
  direccion    VARCHAR(200),
  ciudad       VARCHAR(100),
  codigoPostal VARCHAR(20),
  rol          TINYINT NOT NULL DEFAULT 0,  -- 0: cliente, 1: admin
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id_producto  INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(150) NOT NULL,
  descripcion  TEXT,
  precio       DECIMAL(10,2) NOT NULL,
  stock_actual INT NOT NULL DEFAULT 0,
  stock_minimo INT NOT NULL DEFAULT 5,
  categoria    VARCHAR(100) NOT NULL,
  tipo_unidad  VARCHAR(50) NOT NULL,          -- ej: kg, unidad, litro
  valor_medida DECIMAL(10,3) NOT NULL,        -- ej: 1.5 (kg), 500 (gr)
  imagen_url   VARCHAR(500),
  activo       TINYINT NOT NULL DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id_pedido    INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario   INT NOT NULL,
  total        DECIMAL(10,2) NOT NULL,
  estado       ENUM('Pendiente','Confirmado','Enviado','Completado','Cancelado') NOT NULL DEFAULT 'Pendiente',
  direccion    VARCHAR(200),
  observaciones TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES users(id_usuario)
);

-- Tabla de items de pedido
CREATE TABLE IF NOT EXISTS pedido_items (
  id_item      INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido    INT NOT NULL,
  id_producto  INT NOT NULL,
  nombre       VARCHAR(150) NOT NULL,
  precio       DECIMAL(10,2) NOT NULL,
  cantidad     INT NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla de turnos
CREATE TABLE IF NOT EXISTS turnos (
  id_turno        INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario      INT NOT NULL,
  nombre_mascota  VARCHAR(100) NOT NULL,
  especie_mascota VARCHAR(50) NOT NULL DEFAULT 'Perro',
  servicio        VARCHAR(100) NOT NULL,
  fecha_hora      DATETIME NOT NULL,
  observaciones   TEXT,
  estado          ENUM('Pendiente','Confirmado','Cancelado','Completado') NOT NULL DEFAULT 'Pendiente',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES users(id_usuario)
);
