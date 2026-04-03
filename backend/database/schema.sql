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
  stock        INT NOT NULL DEFAULT 0,
  categoria    VARCHAR(100),
  imagen_url   VARCHAR(500),
  activo       TINYINT NOT NULL DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
