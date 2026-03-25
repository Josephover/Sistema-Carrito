-- ============================================================
-- SISTEMA DE CARRITO - SETUP DE BASE DE DATOS
-- Ejecuta este script COMPLETO en DBeaver
-- ============================================================

-- PASO 1: LIMPIAR
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- PASO 2: USUARIOS
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PASO 3: CATEGORÍAS
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  slug VARCHAR(255) UNIQUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PASO 4: PRODUCTOS
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  cost DECIMAL(12, 2),
  image VARCHAR(512),
  stock INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  status VARCHAR(50) DEFAULT 'active',
  views_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE products ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id);

-- PASO 5: RESEÑAS
CREATE TABLE product_reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id),
  user_id BIGINT NOT NULL REFERENCES users(id),
  rating INTEGER,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PASO 6: CARRITOS
CREATE TABLE carts (
  id UUID PRIMARY KEY,
  user_id BIGINT,
  status VARCHAR(50) DEFAULT 'active',
  total_price DECIMAL(12, 2) DEFAULT 0,
  items_count INTEGER DEFAULT 0,
  last_activity TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE carts ADD CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id);

-- PASO 7: ITEMS DEL CARRITO
CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES carts(id),
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  discount DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PASO 8: PEDIDOS
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(12, 2) NOT NULL,
  shipping_cost DECIMAL(12, 2) DEFAULT 0,
  tax DECIMAL(12, 2) DEFAULT 0,
  discount DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id);

-- PASO 9: ITEMS DE PEDIDO
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id),
  product_id BIGINT,
  quantity INTEGER NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id);

-- PASO 10: INSERTAR CATEGORÍAS
INSERT INTO categories (name, slug, description) 
VALUES
('Laptops', 'laptops', 'Computadoras portátiles'),
('Periféricos', 'perifericos', 'Ratones, teclados y accesorios'),
('Monitores', 'monitores', 'Pantallas'),
('Audio', 'audio', 'Auriculares y sonido'),
('Almacenamiento', 'almacenamiento', 'SSD y discos');

-- PASO 11: INSERTAR USUARIOS
INSERT INTO users (email, name) 
VALUES
('user1@example.com', 'Juan García'),
('user2@example.com', 'María López'),
('user3@example.com', 'Carlos Rodríguez');

-- PASO 12: INSERTAR PRODUCTOS
INSERT INTO products (category_id, name, slug, price, cost, description, stock, sku) 
VALUES
(1, 'Laptop Dell XPS', 'laptop-dell-xps', 999.99, 650.00, 'Laptop de alto rendimiento', 15, 'LP-DELL-XPS'),
(2, 'Mouse Logitech', 'mouse-logitech', 29.99, 12.00, 'Mouse inalámbrico', 50, 'MS-LOG-001'),
(2, 'Teclado RGB', 'teclado-mecanico-rgb', 79.99, 35.00, 'Teclado mecánico', 30, 'KB-MEC-RGB'),
(3, 'Monitor LG 4K', 'monitor-lg-4k', 299.99, 180.00, 'Monitor 4K 27"', 20, 'MN-LG-4K27'),
(4, 'Auriculares Sony', 'auriculares-sony', 149.99, 85.00, 'Auriculares premium', 25, 'HP-SONY-WH'),
(5, 'SSD Samsung 1TB', 'ssd-samsung-1tb', 89.99, 50.00, 'SSD NVMe', 40, 'STG-SAMSUNG-1TB'),
(2, 'Cargador USB-C', 'cargador-usb-c', 34.99, 15.00, 'Cargador 65W', 60, 'CHG-USB-C65'),
(2, 'Cable HDMI 2.1', 'cable-hdmi-21', 19.99, 7.00, 'Cable HDMI', 80, 'CBL-HDMI-2M'),
(2, 'Soporte Monitor', 'soporte-monitor', 39.99, 18.00, 'Soporte ajustable', 35, 'ACC-STAND-MN'),
(1, 'Notebook HP', 'notebook-hp-pavilion', 599.99, 380.00, 'Notebook HP', 20, 'NB-HP-PAV');

-- VERIFICACIÓN
SELECT '✅ BASE DE DATOS LISTA' AS status;
SELECT COUNT(*) as usuarios FROM users;
SELECT COUNT(*) as categorias FROM categories;
SELECT COUNT(*) as productos FROM products;
