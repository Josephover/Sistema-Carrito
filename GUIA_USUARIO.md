# 📖 GUÍA DE USO - SISTEMA DE CARRITO

## 🎯 Introducción

Este sistema tiene **3 roles diferentes** cada uno con su propia interfaz y funcionalidades:

1. **Administrador**: Gestiona todo el sistema
2. **Vendedor**: Crea y vende productos
3. **Cliente**: Compra productos

---

## 👨‍💼 PANEL ADMINISTRADOR

**Acceso:** `admin@example.com` / `pass`

### Pantalla 1: 📊 Dashboard Overview

Muestra métricas en tiempo real:
- **Total Usuarios**: Cantidad de usuarios registrados
- **Total Productos**: Cantidad de productos en la plataforma
- **Total Pedidos**: Cantidad de órdenes realizadas
- **Ingresos**: Suma de todas las ventas

### Pantalla 2: 👥 Gestión de Usuarios

**Tabla con:**
- ID del usuario
- Email
- Nombre
- Estado (active/inactive)
- Fecha de creación

**Funciones:**
- Ver todos los usuarios
- Información de cada usuario

### Pantalla 3: 📦 Gestión de Productos

**Tabla con:**
- ID del producto
- Nombre
- Precio
- Stock disponible
- Categoría
- Estado

**Funciones:**
- Ver todos los productos en el sistema
- Monitorear inventario
- Estado de los productos

### Pantalla 4: 📋 Gestión de Pedidos

**Tabla con:**
- Número de pedido
- Cliente (email)
- Total de la compra
- Estado del pedido
- Fecha del pedido

**Funciones:**
- Ver todos los pedidos
- Monitorear estado de ventas
- Historial completo de órdenes

**Navegación:** Use los botones en la barra superior para cambiar entre secciones

---

## 📦 PANEL VENDEDOR

**Acceso:** `vendor@example.com` / `pass`

### Pantalla 1: Mis Productos

Muestra una cuadrícula de los productos que has creado (como vendedor).

**Para cada producto:**
- Imagen (placeholder)
- Nombre
- Precio
- Stock disponible
- Botones: **Editar** | **Eliminar**

### Pantalla 2: ➕ Agregar Producto

**Formulario para crear un nuevo producto:**

```
Nombre: ________________
Precio: ________________
Categoría: [Dropdown]
Stock: ________________
Descripción: 
[Textarea multi-línea]

         [Crear Producto]
```

**Pasos:**
1. Completa todos los campos
2. Selecciona categoría disponible
3. Click en "Crear Producto"
4. Recibirás confirmación ✅

**Variables requeridas:**
- **Nombre**: Nombre del producto (ej: "Laptop 15 pulgadas")
- **Precio**: Precio en USD (ej: 899.99)
- **Categoría**: Select de categorías disponibles
- **Stock**: Cantidad disponible (número entero)
- **Descripción**: Detalles del producto (opcional)

### Pantalla 3: 💰 Mis Ventas

**Tabla de ventas realizadas:**
- Producto vendido
- Cantidad vendida
- Valor total
- Fecha de venta

**Funciones:**
- Ver historial de todas tus ventas
- Monitorear ingresos
- Seguimiento de qué productos venden más

---

## 👤 PANEL CLIENTE

**Acceso:** `user1@example.com` / `pass`

### Pantalla 1: 🏪 Tienda

**Buscador y filtros:**
- 🔍 Campo de búsqueda: Busca por nombre o descripción
- 📂 Filtro de categoría: Filtra por categoría

**Grid de productos:**
- Imagen del producto
- Nombre
- Descripción
- Precio
- Stock disponible
- Botón: **🛒 Añadir al Carrito**

**Cómo comprar:**
1. Busca productos (opcional)
2. Filtra por categoría (opcional)
3. Click en "🛒 Añadir al Carrito"
4. Producto se añade automáticamente (Socket.IO en tiempo real)

### Pantalla 2: 🛒 Mi Carrito

**Tabla del carrito:**
```
Producto | Precio | Cantidad | Subtotal | Acción
---------|--------|----------|----------|-------
Laptop   | $899   | 2        | $1798    | 🗑️
Monitor  | $299   | 1        | $299     | 🗑️
```

**Funciones:**
- **Actualizar cantidad**: Cambia el número en la columna "Cantidad"
- **Eliminar producto**: Click en 🗑️
- **Ver total**: Se actualiza automáticamente

**Pie del carrito:**
```
Total: $2,097.00

[Comprar Ahora]  [Vaciar Carrito]
```

**Acciones:**
- **Comprar Ahora**: Procesa la orden y la registra
- **Vaciar Carrito**: Elimina todo (pide confirmación)

### Pantalla 3: 📦 Mis Pedidos

**Tabla de órdenes:**
```
Número    | Fecha      | Total    | Estado
----------|------------|----------|----------
ORD-12345 | 2026-03-24 | $2097.00 | pending
ORD-12344 | 2026-03-23 | $899.99  | completed
```

**Información:**
- Número de pedido único
- Fecha exacta del pedido
- Monto total
- Estado: pending (pendiente) / completed (completado)

---

## 🔄 CARACTERÍSTICAS EN TIEMPO REAL (Socket.IO)

### Sincronización Instantánea

**Cliente A agrega producto → Cliente B ve actualización automática**

Esto funciona gracias a Socket.IO:
- Cuando agregas un producto, todos los clientes viendo el carrito se actualizan
- Cambios en cantidad se propagan al momento
- Eliminaciones se sincronizan en tiempo real

### Cómo funciona:
1. Cliente A: Click en "Añadir"
2. Frontend envía: `socket.emit('add_to_cart', {...})`
3. Servidor procesa
4. Servidor broadcast: `socket.emit('item_added')`
5. Cliente B recibe y actualiza automáticamente

---

## 💡 TIPS Y TRUCOS

### Admin
- 📊 Revisa el Overview primero para métricas generales
- 📦 Si el stock es bajo, solicita al vendedor que lo aumente
- 📋 Los pedidos en "pending" necesitan seguimiento

### Vendedor
- 📈 Agrega productos en horarios picos para más visibilidad
- 🔍 Revisa tus ventas regularmente
- 💰 Los productos populares pueden necesitar más stock

### Cliente
- 🔍 Usa el buscador para encontrar rápido
- 📂 Filtra por categoría para explorar
- 🛒 El carrito se sincroniza en tiempo real
- ✅ Revisa "Mis Pedidos" para historial

---

## ❌ PROBLEMAS COMUNES

### P1: No veo productos en la tienda
**R:** 
1. Espera a que carguen (red lenta)
2. Recarga la página (F5)
3. Revisa consola (F12) para errores

### P2: El carrito no se actualiza
**R:**
1. Verifica conexión Socket.IO (console)
2. Reinicia servidor backend
3. Limpia cache del navegador (Ctrl+Shift+Del)

### P3: "Producto agotado" pero veo stock
**R:**
1. Recarga la página
2. Otro cliente puede haber comprado justo antes

### P4: No puedo crear un producto
**R:**
1. Verifica que todos los campos estén completos
2. Revisa la categoría seleccionada
3. Mira errores en consola (F12)

---

## 📊 DATOS DEMO INICIALES

### Categorías (5)
- Laptops
- Periféricos
- Monitores
- Audio
- Almacenamiento

### Usuarios (3)
- admin@example.com (Admin)
- vendor@example.com (Vendedor)
- user1@example.com (Cliente)
- user2@example.com (Cliente)
- user3@example.com (Cliente)

### Productos (10 iniciales)
- MacBook Pro
- Monitor LG 27"
- Teclado Mecánico
- Mouse Logitech
- Headphones Sony
- SSD 1TB
- Y 4 más...

---

## 🎯 FLUJO COMPLETO DE USUARIO

### Cliente Nuevo
```
1. Ir a http://localhost:3000
2. Seleccionar "Cliente"
3. Email: user1@example.com
4. Contraseña: pass
5. Click "Ingresar"
6. Ver tienda con productos
7. Buscar/filtrar lo deseado
8. Agregar al carrito
9. Ver carrito actualizado
10. Click "Comprar Ahora"
11. Ver orden en "Mis Pedidos"
```

### Vendedor Nuevo
```
1. Ir a http://localhost:3000
2. Seleccionar "Vendedor"
3. Email: vendor@example.com
4. Contraseña: pass
5. Click "Ingresar"
6. Click en "Agregar Producto"
7. Completar formulario
8. Click "Crear Producto"
9. Ver en "Mis Productos"
10. Revisar "Mis Ventas"
```

### Admin
```
1. Ir a http://localhost:3000
2. Seleccionar "Administrador"
3. Email: admin@example.com
4. Contraseña: pass
5. Click "Ingresar"
6. Ver Dashboard (métricas)
7. Revisar Usuarios
8. Monitorear Productos
9. Ver Pedidos
```

---

## 📞 SOPORTE

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que el backend esté corriendo
3. Intenta refrescar la página (F5)
4. Reinicia el servidor si es necesario

---

**Versión:** 1.0.0  
**Última actualización:** Marzo 2026
