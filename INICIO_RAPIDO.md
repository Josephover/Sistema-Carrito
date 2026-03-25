# 🚀 INICIO RÁPIDO - 5 MINUTOS

## ⏱️ Tiempo total: ~5 minutos

### Paso 1️⃣: Verificar Base de Datos  [1 min]

```bash
# Si la BD ya está creada, skip esto
# Si NO: Abrir DBeaker
# 1. Click derecho en "carrito_db"
# 2. SQL Editor → Open SQL Script
# 3. Abrir: c:\laragon\www\Carrito\init-db.sql
# 4. Ctrl+A → Ctrl+Enter
```

✅ **Resultado esperado:** ✅ BASE DE DATOS LISTA (con tablas y datos demo)

---

### Paso 2️⃣: Instalar Dependencias  [2 min]

```bash
cd c:\laragon\www\Carrito\backend
npm install
```

✅ **Resultado esperado:** mensaje "added XX packages"

---

### Paso 3️⃣: Crear Archivo .env  [1 min]

Crear archivo: `c:\laragon\www\Carrito\backend\.env`

Contenido:
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

(Cambiar `password` por tu contraseña real de PostgreSQL)

✅ **Resultado esperado:** Archivo `.env` creado

---

### Paso 4️⃣: Iniciar Servidor  [1 min]

```bash
# Opción A: Desde /backend
cd c:\laragon\www\Carrito\backend
npm run dev

# Opción B: Desde raíz (necesita package.json raíz actualizado)
cd c:\laragon\www\Carrito
npm run dev
```

✅ **Resultado esperado:**
```
✅ Servidor ejecutándose en puerto 3000
✅ Base de datos conectada
```

---

### Paso 5️⃣: Abrir en Navegador  [<1 min]

```
http://localhost:3000
```

---

## 👤 PROBAR LOS 3 ROLES

### 1️⃣ Administrador
- **Email:** admin@example.com
- **Pass:** pass
- **Rol:** Administrador

**Verás:** Dashboard con métricas (50 usuarios, 100 productos, etc.)

### 2️⃣ Vendedor
- **Email:** vendor@example.com
- **Pass:** pass
- **Rol:** Vendedor

**Verás:** Panel para agregar productos

### 3️⃣ Cliente
- **Email:** user1@example.com
- **Pass:** pass
- **Rol:** Cliente

**Verás:** Tienda de productos para comprar

---

## ✅ CHECKLIST FINAL

```
☑️  BD creada
☑️  Dependencias instaladas
☑️  .env configurado
☑️  Servidor corriendo (puerto 3000)
☑️  http://localhost:3000 accesible
☑️  Login funciona
☑️  Admin ves dashboard
☑️  Vendedor ves formulario de productos
☑️  Cliente ves tienda
☑️  Socket.IO conecta (check console F12)
```

---

## 🐛 Si algo no funciona

### Error: "Cannot find module"
```bash
cd backend && npm install
```

### Error: "Port 3000 already in use"
```bash
# Cambiar PORT en .env a 3001:
PORT=3001

# O matar proceso:
# Windows: taskkill /PID xxxx /F
```

### Error: "Connect ECONNREFUSED"
1. Verificar que PostgreSQL está corriendo
2. Verificar credenciales en `.env`
3. Verificar BD existe: `carrito_db`

### Carrito no sincroniza
- Abre Console (F12)
- Verifica que Socket.IO conecta
- Reinicia servidor

---

## 📊 ESTRUCTURA FINAL

```
c:\laragon\www\Carrito\
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/       [5 controllers]
│   │   ├── models/            [5 models]
│   │   ├── routes/            [5 routes]
│   │   ├── sockets/
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env                   [TÚ lo creas]
├── frontend/
│   ├── index.html             [3 dashboards]
│   ├── app.js                 [600+ líneas]
│   └── styles.css             [700+ líneas]
├── init-db.sql                [BD lista]
├── package.json               [scripts]
├── README.md                  [docs completa]
├── GUIA_USUARIO.md            [manual usuario]
└── setup.sh                   [auto-setup]
```

---

## 🎯 FUNCIONALIDADES PRINCIPALES

| Rol | Ver Usuarios | Ver Productos | Crear Productos | Comprar | Ver Pedidos | Socket.IO |
|-----|:---:|:---:|:---:|:---:|:---:|:---:|
| Admin | ✅ | ✅ | ❌ | ❌ | ✅ | ⏸️ |
| Vendedor | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Cliente | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |

---

## 💾 DATOS DEMO INICIALES

**Categorías (5):**
- Laptops
- Periféricos
- Monitores
- Audio
- Almacenamiento

**Productos (10):**
- MacBook Pro 16" ($2399)
- Monitor LG 27" ($399)
- Teclado Mecánico RGB ($159)
- Mouse Logitech MX ($99)
- Headphones Sony WH ($299)
- SSD Samsung 1TB ($149)
- Y 4 más...

**Usuarios (3+):**
- admin@example.com (Admin)
- vendor@example.com (Vendedor)
- user1@example.com (Cliente)
- user2@example.com (Cliente)
- user3@example.com (Cliente)

---

## 📱 TESTING RECOMENDADO

1. **Admin**: Revisar todos los datos en dashboard
2. **Vendor**: Crear un producto nuevo
3. **Cliente 1**: Agregar producto al carrito
4. **Cliente 2**: En otra ventana, ver la actualización de cliente 1 (Socket.IO real-time)
5. **Cliente 1**: Proceder al checkout
6. **Admin**: Verificar el nuevo pedido

---

## ⭐ TIPS

- El gradiente morado es bonito (CSS)
- El carrito se actualiza en tiempo real (Socket.IO)
- Puedes tener múltiples ventanas abiertas
- La BD es escalable para futuros cambios
- Documentación completa en README.md

---

## 🎉 ¡LISTO!

Si todo está funcionando:

```
✅ http://localhost:3000 carga
✅ Puedes loguear con cualquier rol
✅ Dashboard se ve bonito
✅ Carrito sincroniza en tiempo real
✅ Base de datos tiene datos
```

**¡FELICIDADES! Sistema 100% funcional** 🎊

---

**Documentación adicional:** Revisa `GUIA_USUARIO.md` para detalles de cada rol.
