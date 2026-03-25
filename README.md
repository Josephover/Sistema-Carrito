# 🛒 SISTEMA DE CARRITO DE COMPRAS EN TIEMPO REAL

Un sistema completo de e-commerce con **3 roles de usuario** (Administrador, Vendedor, Cliente) basado en **Node.js, Socket.IO y PostgreSQL**.

## 🚀 Características Principales

### 👨‍💼 Panel Administrador
- **Dashboard Overview**: Estadísticas en tiempo real (usuarios, productos, pedidos, ingresos)
- **Gestión de Usuarios**: Ver todos los usuarios registrados con detalles
- **Gestión de Productos**: Inventario completo con búsqueda y filtrado
- **Gestión de Pedidos**: Monitoreo de todas las órdenes realizadas

### 📦 Panel Vendedor  
- **Mis Productos**: Lista de productos que ha creado
- **Agregar Productos**: Formulario para crear nuevos productos
- **Mis Ventas**: Seguimiento de ventas realizadas

### 👤 Panel Cliente
- **🏪 Tienda**: Catálogo con buscador y filtro por categoría
- **🛒 Mi Carrito**: Carrito con actualización en tiempo real via Socket.IO
- **📦 Mis Pedidos**: Historial de órdenes realizadas

## 🛠️ Stack Tecnológico

**Backend:**
- Node.js + Express.js 4.18
- Socket.IO 4.5 (comunicación real-time)
- PostgreSQL 12+ (base de datos relacional)
- UUID para IDs únicos de carritos

**Frontend:**
- HTML5 + CSS3 (Responsive Design, Mobile-First)
- JavaScript ES6+ Vanilla
- Socket.IO Client
- Gradientes y animaciones modernas

## 📋 Requisitos Previos

- **Node.js** v16+ (con npm)
- **PostgreSQL** 12+
- **Laragon** o PostgreSQL instalado localmente
- **DBeaver** o cliente PostgreSQL
- Puerto **3000** disponible

## 🔧 Instalación Rápida

### 1️⃣ Base de Datos

**En DBeaver:**
1. Click derecho en `carrito_db` → SQL Editor
2. Open SQL Script → Seleccionar `/init-db.sql`
3. Ctrl+A → Ctrl+Enter (ejecutar)

**Resultado:** ✅ 9 tablas creadas + datos de demo

### 2️⃣ Instalar Dependencias
```bash
cd c:\laragon\www\Carrito\backend
npm install
```

### 3️⃣ Variables de Entorno

Crear `/backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carrito_db
DB_USER=postgres
DB_PASSWORD=password
CLIENT_URL=http://localhost:3000
PORT=3000
NODE_ENV=development
```

### 4️⃣ Iniciar el Servidor

```bash
# Desde raíz del proyecto
npm run dev

# O desde /backend
npm start
# En desarrollo (con auto-reload):
npm run dev
```

**Resultado:** ✅ `Servidor ejecutándose en puerto 3000`

### 5️⃣ Abrir en Navegador

```
http://localhost:3000
```

## 👤 Cuentas de Demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@example.com | pass |
| Vendedor | vendor@example.com | pass |
| Cliente | user1@example.com | pass |

## 📁 Estructura del Proyecto

```
Carrito/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js              # Pool PostgreSQL
│   │   ├── controllers/
│   │   │   ├── productController.js     # Lógica productos
│   │   │   ├── cartController.js        # Lógica carrito
│   │   │   ├── userController.js        # Gestión usuarios
│   │   │   ├── orderController.js       # Gestión órdenes
│   │   │   └── categoryController.js    # Gestión categorías
│   │   ├── models/
│   │   │   ├── Product.js               # Modelo productos
│   │   │   ├── Cart.js                  # Modelo carrito
│   │   │   ├── User.js                  # Modelo usuarios
│   │   │   ├── Order.js                 # Modelo órdenes
│   │   │   └── Category.js              # Modelo categorías
│   │   ├── routes/
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── categoryRoutes.js
│   │   ├── sockets/
│   │   │   └── cartSocket.js            # Socket.IO eventos
│   │   └── app.js                       # Config Express
│   ├── server.js                        # Entry point
│   └── package.json
├── frontend/
│   ├── index.html                       # 3 dashboards unificados
│   ├── app.js                           # Lógica de 3 roles
│   └── styles.css                       # Estilos modernos
├── init-db.sql                          # Script SQL BD
├── package.json                         # Scripts raíz
└── README.md
```

## 🔌 API Endpoints

### 📦 Productos
```
GET    /api/products                    # Todos los productos
GET    /api/products/:id                # Un producto
POST   /api/products                    # Crear producto
PUT    /api/products/:id                # Actualizar
DELETE /api/products/:id                # Eliminar
```

### 🛒 Carrito
```
POST   /api/cart                        # Crear carrito
GET    /api/cart/:cartId                # Obtener carrito
POST   /api/cart/:cartId/items          # Agregar item
PUT    /api/cart/:cartId/items/:itemId  # Actualizar cantidad
DELETE /api/cart/:cartId/items/:itemId  # Eliminar item
DELETE /api/cart/:cartId                # Vaciar carrito
```

### 👥 Usuarios
```
GET    /api/users                       # Todos
GET    /api/users/:id                   # Uno
POST   /api/users                       # Crear
PUT    /api/users/:id                   # Actualizar
DELETE /api/users/:id                   # Eliminar
```

### 📋 Órdenes
```
GET    /api/orders                      # Todas
GET    /api/orders/:id                  # Una
POST   /api/orders                      # Crear
PUT    /api/orders/:id                  # Actualizar
DELETE /api/orders/:id                  # Eliminar
```

### 🏷️ Categorías
```
GET    /api/categories                  # Todas
GET    /api/categories/:id              # Una
POST   /api/categories                  # Crear
PUT    /api/categories/:id              # Actualizar
DELETE /api/categories/:id              # Eliminar
```

## 🔴 Socket.IO Eventos

### Cliente → Servidor (Emits)
```javascript
// Unirse a una sala de carrito
socket.emit('join_cart', { cartId })

// Agregar producto
socket.emit('add_to_cart', { 
  cartId, 
  productId, 
  quantity, 
  price 
})

// Actualizar cantidad
socket.emit('update_item', { 
  cartId, 
  itemId, 
  quantity 
})

// Eliminar item
socket.emit('remove_from_cart', { 
  cartId, 
  itemId 
})

// Vaciar carrito
socket.emit('clear_cart', { cartId })

// Obtener datos actuales
socket.emit('get_cart', { cartId })
```

### Servidor → Cliente (Listeners)
```javascript
socket.on('item_added', (item) => {})
socket.on('item_updated', (item) => {})
socket.on('item_removed', (data) => {})
socket.on('cart_cleared', () => {})
socket.on('cart_data', (cart) => {})
```

## 📊 Esquema Base de Datos

**9 Tablas optimizadas:**
```
users ──┬──→ product_reviews ←─── products ←─── categories
        │                             ↓
        ├──→ carts ──→ cart_items ───┘
        │
        └──→ orders ─→ order_items ──→ products
```

**Características:**
- ✅ BIGSERIAL (IDs escalables)
- ✅ UUID para carritos (seguridad)
- ✅ Índices en columnas frecuentes
- ✅ Foreign Keys con CASCADE
- ✅ Timestamps automáticos
- ✅ Constraints configuración futura

## 🎨 Diseño Visual

- **Gradiente Principal**: `#667eea` → `#764ba2`
- **Colores:**
  - Success: `#4caf50`
  - Danger: `#f44336`
  - Warning: `#ff9800`
  - Info: `#667eea`
- **Responsive Breakpoints**: 1024px, 768px, 480px
- **Animaciones**: Slide-in notifications, hover effects

## 🚀 Scripts Disponibles

```bash
# Desde raíz (c:\laragon\www\Carrito)
npm run dev         # npm run dev (backend)
npm start           # npm start (backend)

# Desde /backend
npm start           # Inicia servidor
npm run dev         # Inicia con nodemon (desarrollo)
npm install         # Instala dependencias
```

## 🐛 Troubleshooting

### Error: Module not found
```bash
cd backend && npm install
```

### PostgreSQL Connection Refused
1. Verificar que PostgreSQL está corriendo
2. Revisar credenciales en `.env`
3. Crear DB: `createdb carrito_db`

### Socket.IO No Conecta
1. Verificar puerto 3000 disponible
2. Revisar console del navegador (F12)
3. Reiniciar servidor

### Base de datos sin datos
```bash
# Re-ejecutar script en DBeaver:
# 1. Click derecho carrito_db → SQL Editor
# 2. Open SQL Script → init-db.sql
# 3. Ctrl+A → Ctrl+Enter
```

## 📝 Flujo de Uso

### Cliente
1. Login (demo: user1@example.com / pass)
2. Buscar/filtrar productos
3. Agregar al carrito
4. Ver carrito sincronizado en tiempo real
5. Proceder al checkout
6. Ver pedido en "Mis Pedidos"

### Vendedor
1. Login (demo: vendor@example.com / pass)
2. Ver "Mis Productos"
3. Agregar nuevo producto
4. Monitorear "Mis Ventas"

### Admin
1. Login (demo: admin@example.com / pass)
2. Dashboard Overview (métricas)
3. Gestionar usuarios, productos, pedidos

## 🔒 Seguridad (Por Implementar)

- [ ] JWT para autenticación segura
- [ ] Hash de passwords con bcrypt
- [ ] Validación de inputs
- [ ] Rate limiting
- [ ] HTTPS en producción
- [ ] CSRF protection

## 📈 Mejoras Futuras

- Carrito persistent guardado en BD
- Sistema de comentarios y ratings
- Notificaciones por email
- Integración Stripe/PayPal
- Reportes avanzados
- Sistema de promocodes
- Historial de cambios

## 💡 Desarrollo Local

**Editar archivo:**
- Frontend: `/frontend/app.js`, `/frontend/styles.css`
- Backend: `/backend/src/**`
- BD: `/init-db.sql`

**Reiniciar después de cambios:**
```bash
# Backend automático con nodemon
npm run dev

# Frontend: Recargar página (F5)
```

## 📞 Soporte

Para bugs o sugerencias, reportar en gestor de issues del proyecto.

## 📄 Licencia

MIT - Libre para uso comercial y personal.

---


│
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── README.md
└── .gitignore
```

## 🔧 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd Carrito
```

### 2. Configurar la Base de Datos

Crea una base de datos PostgreSQL:

```sql
-- Crear base de datos
CREATE DATABASE carrito_db;

-- Conectar a la base de datos
\c carrito_db;

-- Crear tabla de productos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de carritos
CREATE TABLE carts (
  id UUID PRIMARY KEY,
  user_id INTEGER,
  total_price DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de items del carrito
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar productos de ejemplo
INSERT INTO products (name, price, description) VALUES
('Laptop', 999.99, 'Laptop de alto rendimiento'),
('Mouse', 29.99, 'Mouse inalámbrico ergonómico'),
('Teclado', 79.99, 'Teclado mecánico RGB'),
('Monitor', 299.99, 'Monitor 4K 27 pulgadas'),
('Webcam', 49.99, 'Webcam Full HD 1080p');
```

### 3. Configurar Variables de Entorno

Renombra `.env.example` a `.env` en la carpeta `backend`:

```bash
cd backend
cp .env.example .env
```

Edita `.env` con tus credenciales de PostgreSQL:

```env
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carrito_db
PORT=3000
CLIENT_URL=http://localhost:5173
```

### 4. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

## 🏃 Ejecución

### Backend

```bash
cd backend

# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Frontend

```bash
# Abre el archivo frontend/index.html en tu navegador
# O sirve desde un servidor local (ej: Live Server en VS Code)
```

Accede a `http://localhost:5173` (o la URL donde tengas servido el frontend)

## 📡 API REST

### Productos

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Carrito

- `POST /api/cart` - Crear nuevo carrito
- `GET /api/cart/:cartId` - Obtener carrito
- `POST /api/cart/:cartId/items` - Añadir item
- `PUT /api/cart/:cartId/items/:itemId` - Actualizar cantidad
- `DELETE /api/cart/:cartId/items/:itemId` - Eliminar item
- `DELETE /api/cart/:cartId/clear` - Vaciar carrito

## 🔌 Eventos Socket.IO

### Cliente → Servidor

```javascript
// Unirse a un carrito
socket.emit('join_cart', cartId);

// Añadir producto
socket.emit('add_to_cart', {
  cartId: 'uuid',
  productId: 1,
  quantity: 1,
  price: 29.99
});

// Actualizar cantidad
socket.emit('update_item', {
  cartId: 'uuid',
  itemId: 1,
  quantity: 2
});

// Eliminar item
socket.emit('remove_from_cart', {
  cartId: 'uuid',
  itemId: 1
});

// Vaciar carrito
socket.emit('clear_cart', cartId);
```

### Servidor → Cliente

```javascript
// Item añadido
socket.on('item_added', (item) => {});

// Item actualizado
socket.on('item_updated', (item) => {});

// Item eliminado
socket.on('item_removed', (data) => {});

// Carrito vaciado
socket.on('cart_cleared', () => {});

// Usuario se unió
socket.on('user_joined', (data) => {});

// Usuario se fue
socket.on('user_left', (data) => {});

// Error
socket.on('error', (error) => {});
```

## 🎨 Características

✅ Carrito en tiempo real multiusuario
✅ Actualización automática de cantidades
✅ Cálculo dinámico de totales
✅ Notificaciones en vivo
✅ Contador de usuarios activos
✅ Interfaz responsive
✅ Manejo de errores robusto
✅ Validación de datos

## 🐛 Solución de Problemas

### Error de conexión a BD
- Verifica que PostgreSQL esté corriendo
- Comprueba las credenciales en `.env`
- Asegúrate de haber creado las tablas

### Socket.IO no conecta
- Confirma que el servidor backend está corriendo
- Verifica que el `CLIENT_URL` en `.env` sea correcto
- Abre la consola del navegador para ver errores

### Puerto 3000 ya está en uso
- Cambia el `PORT` en `.env` a otro disponible
- O mata el proceso que usa el puerto

## 📝 Notas para Desarrollo

- Mientras editas, usa `npm run dev` en el backend para usar nodemon
- El frontend no requiere build, solo abre el HTML
- Los cambios en Socket.IO requieren reiniciar el servidor

## 📄 Licencia

MIT

## 👨‍💻 Autor

Tu nombre aquí

---

¡Disfruta construyendo tu carrito en tiempo real! 🚀
