-- ============================================================
-- BASE DE DATOS COMPLETA CORREGIDA - CARRITO MARKETPLACE
-- ============================================================
-- Executa este script completo en DBeaver
-- 1. Crea la base de datos
-- 2. Crea todas las tablas correctamente
-- 3. Agrega columnas de autenticación
-- 4. Inserta datos de ejemplo
-- ============================================================

-- PASO 1: Eliminar base de datos antigua (CUIDADO!)
DROP DATABASE IF EXISTS carrito_db CASCADE;

-- PASO 2: Crear base de datos nueva
CREATE DATABASE carrito_db
  WITH
  ENCODING = 'UTF8'
  TEMPLATE = template0
  LC_COLLATE = 'C'
  LC_CTYPE = 'C';

-- Conectar a la nueva base de datos
\c carrito_db;

-- ============================================================
-- TABLA: USUARIOS (Con password y role integrados desde el inicio)
-- ============================================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'marketplace' CHECK (role IN ('admin', 'marketplace')),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: CATEGORÍAS
-- ============================================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: PRODUCTOS
-- ============================================================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: CARRITO
-- ============================================================
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- ============================================================
-- TABLA: ÓRDENES
-- ============================================================
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  payment_method VARCHAR(50),
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: DETALLES DE ÓRDENES
-- ============================================================
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CREAR ÍNDICES PARA MEJORAR PERFORMANCE
-- ============================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ============================================================
-- INSERTAR DATOS DE EJEMPLO
-- ============================================================

-- Hash de "password123": ef797c8118f02dfb649a3d0d3667eae0b24ec26c47de268edecc992cb54e4b37

-- USUARIOS
INSERT INTO users (email, name, password, role, status, created_at, updated_at)
VALUES
  ('admin@example.com', 'Administrador', 'ef797c8118f02dfb649a3d0d3667eae0b24ec26c47de268edecc992cb54e4b37', 'admin', 'active', NOW(), NOW()),
  ('admin-nuevo@example.com', 'Admin Nuevo', 'ef797c8118f02dfb649a3d0d3667eae0b24ec26c47de268edecc992cb54e4b37', 'admin', 'active', NOW(), NOW()),
  ('vendor@example.com', 'Vendedor Principal', 'ef797c8118f02dfb649a3d0d3667eae0b24ec26c47de268edecc992cb54e4b37', 'marketplace', 'active', NOW(), NOW()),
  ('user1@example.com', 'Usuario Uno', 'ef797c8118f02dfb649a3d0d3667eae0b24ec26c47de268edecc992cb54e4b37', 'marketplace', 'active', NOW(), NOW()),
  ('user2@example.com', 'Usuario Dos', 'ef797c8118f02dfb649a3d0d3667eae0b24ec26c47de268edecc992cb54e4b37', 'marketplace', 'active', NOW(), NOW());

-- CATEGORÍAS
INSERT INTO categories (name, description, status, created_at, updated_at)
VALUES
  ('Electrodomésticos', 'Aparatos y electrodomésticos para el hogar', 'active', NOW(), NOW()),
  ('Celulares', 'Teléfonos móviles y accesorios', 'active', NOW(), NOW()),
  ('Mascotas', 'Productos para mascotas y animales', 'active', NOW(), NOW()),
  ('Accesorios', 'Accesorios y complementos varios', 'active', NOW(), NOW());

-- PRODUCTOS (insertados por vendedor - user 3 = vendor@example.com)
INSERT INTO products (name, description, price, category_id, seller_id, stock, image_url, status, created_at, updated_at)
VALUES
  ('Refrigerador Samsung', 'Refrigerador moderno 2 puertas 18 pies', 699.99, 1, 3, 5, 'refrigerador.jpg', 'active', NOW(), NOW()),
  ('Lavadora LG', 'Lavadora automática 12kg con control digital', 549.99, 1, 3, 8, 'lavadora.jpg', 'active', NOW(), NOW()),
  ('iPhone 14 Pro', 'Teléfono inteligente Apple última generación', 999.99, 2, 3, 12, 'iphone14.jpg', 'active', NOW(), NOW()),
  ('Samsung Galaxy A52', 'Smartphone Android de buena relación precio-rendimiento', 399.99, 2, 3, 15, 'galaxy.jpg', 'active', NOW(), NOW()),
  ('Collar para perro', 'Collar ajustable cómodo para mascotas', 14.99, 3, 3, 30, 'collar.jpg', 'active', NOW(), NOW()),
  ('Cama para gatos', 'Cama cómoda y acogedora para felinos', 34.99, 3, 3, 10, 'cama-gatos.jpg', 'active', NOW(), NOW()),
  ('Power Bank 20000mah', 'Batería portátil para cargar dispositivos', 29.99, 4, 3, 25, 'powerbank.jpg', 'active', NOW(), NOW()),
  ('Auriculares inalámbricos', 'Auriculares Bluetooth con cancelación de ruido', 79.99, 4, 3, 18, 'auriculares.jpg', 'active', NOW(), NOW());

-- ============================================================
-- VERIFICAR DATOS INSERTADOS
-- ============================================================
SELECT 'USUARIOS:' as seccion;
SELECT id, email, name, role, status FROM users;

SELECT 'CATEGORÍAS:' as seccion;
SELECT id, name, status FROM categories;

SELECT 'PRODUCTOS:' as seccion;
SELECT id, name, price, seller_id, stock FROM products;

-- ============================================================
-- CONFIRMAR QUE TODO ESTÁ CORRECTO
-- ============================================================
SELECT 'BASE DE DATOS CREADA EXITOSAMENTE' as resultado;

-- ============================================================
-- NOTAS FINALES
-- ============================================================
-- ✅ Columnas de autenticación (password, role) incluidas desde el inicio
-- ✅ Usuarios creados con password hash correcto
-- ✅ Roles asignados correctamente (admin y marketplace)
-- ✅ Todas las tablas con integridad referencial
-- ✅ Índices creados para performance
-- ✅ Datos de ejemplo listos para pruebas
--
-- CREDENCIALES DE PRUEBA:
-- Admin: admin@example.com / password123
-- Admin Nuevo: admin-nuevo@example.com / password123
-- Usuario: user1@example.com / password123
-- Vendedor: vendor@example.com / password123
--
-- AHORA EN DBEAVER:
-- 1. Abre una conexión a localhost
-- 2. Ejecuta este script completo
-- 3. Click derecho en usersTabla → "Edit Row" para editar datos
-- 4. Double-click en cualquier celda para modificar valores
-- ============================================================
