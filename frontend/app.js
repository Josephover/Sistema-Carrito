// ======================== CONFIGURACIÓN ========================
const API_URL = 'http://localhost:3000/api';
let socket = null;
let currentUser = null;
let currentRole = null;
let currentCart = null;
let cartId = null;
let allProducts = [];
let allCategories = [];

// ======================== INICIALIZACIÓN ========================
document.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    currentRole = localStorage.getItem('role');
    initializeSocket();
    showDashboard(currentRole);
  }
});

// ======================== AUTENTICACIÓN ========================

// Mostrar formulario de login
function showLoginForm() {
  document.getElementById('register-form-section').style.display = 'none';
  document.getElementById('login-form-section').style.display = 'block';
  document.getElementById('register-error').style.display = 'none';
  document.getElementById('register-success').style.display = 'none';
}

// Mostrar formulario de registro
function showRegisterForm() {
  document.getElementById('login-form-section').style.display = 'none';
  document.getElementById('register-form-section').style.display = 'block';
  document.getElementById('login-error').style.display = 'none';
}

// Manejar registro
async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirm = document.getElementById('register-confirm').value;
  const errorDiv = document.getElementById('register-error');
  const successDiv = document.getElementById('register-success');

  // Limpiar mensajes previos
  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';

  // Validaciones
  if (!name || !email || !password || !confirm) {
    showError('Todos los campos son obligatorios', errorDiv);
    return;
  }

  if (password !== confirm) {
    showError('Las contraseñas no coinciden', errorDiv);
    return;
  }

  if (password.length < 5) {
    showError('La contraseña debe tener al menos 5 caracteres', errorDiv);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmPassword: confirm })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error en el registro');
    }

    // Mostrar éxito
    successDiv.textContent = '✅ Registro exitoso. Redirigiendo al login...';
    successDiv.style.display = 'block';

    // Limpiar formulario
    document.getElementById('register-form').reset();

    // Redirigir a login después de 2 segundos
    setTimeout(() => {
      showLoginForm();
    }, 2000);
  } catch (error) {
    showError(error.message, errorDiv);
  }
}

// Manejar login
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');

  errorDiv.style.display = 'none';

  if (!email || !password) {
    showError('Email y contraseña son requeridos', errorDiv);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error en el ingreso');
    }

    // Guardar usuario en localStorage
    currentUser = data.user;
    currentRole = data.user.role;

    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('role', currentRole);

    // Inicializar y mostrar dashboard
    initializeSocket();
    showDashboard(currentRole);

    showNotification(`✅ ¡Bienvenido ${currentUser.name}!`);
  } catch (error) {
    showError(error.message, errorDiv);
  }
}

// Función auxiliar para mostrar errores
function showError(message, element) {
  element.textContent = message;
  element.style.display = 'block';
}

function logout() {
  if (socket) socket.disconnect();
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  currentUser = null;
  currentRole = null;
  
  document.getElementById('auth-section').style.display = 'flex';
  document.getElementById('admin-section').style.display = 'none';
  document.getElementById('vendor-section').style.display = 'none';
  document.getElementById('client-section').style.display = 'none';
  
  showNotification('✅ Sesión cerrada');
}

function showDashboard(role) {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('admin-section').style.display = role === 'admin' ? 'block' : 'none';
  document.getElementById('vendor-section').style.display = role === 'marketplace' ? 'block' : 'none';
  document.getElementById('client-section').style.display = 'none';
  
  if (role === 'admin') {
    loadAdminData();
  } else if (role === 'marketplace') {
    loadVendorData();
  }
}

// ======================== SOCKET.IO ========================
function initializeSocket() {
  socket = io('http://localhost:3000');
  
  socket.on('connect', () => {
    console.log('✅ Conectado al servidor');
    if (currentRole === 'customer') {
      initializeCart();
    }
  });
  
  socket.on('item_added', () => {
    loadCart();
    showNotification('✅ Producto añadido al carrito');
  });
  
  socket.on('item_updated', () => {
    loadCart();
  });
  
  socket.on('item_removed', () => {
    loadCart();
    showNotification('✅ Producto eliminado del carrito');
  });
  
  socket.on('cart_cleared', () => {
    loadCart();
    showNotification('🗑️ Carrito vaciado');
  });
  
  socket.on('cart_data', (cart) => {
    currentCart = cart;
    renderCartTable();
  });
  
  socket.on('error', (error) => {
    console.error('Error:', error.message);
    showNotification(error.message, 'error');
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Desconectado del servidor');
  });
}

// ======================== ADMIN DASHBOARD ========================
async function loadAdminData() {
  try {
    console.log('🔄 Cargando datos admin...');
    
    // Hacer todas las solicitudes en paralelo
    const [usersRes, productsRes, ordersRes] = await Promise.all([
      fetch(`${API_URL}/users`),
      fetch(`${API_URL}/products`),
      fetch(`${API_URL}/orders`)
    ]);

    console.log('Respuestas:', usersRes.status, productsRes.status, ordersRes.status);

    const users = usersRes.ok ? await usersRes.json() : [];
    const products = productsRes.ok ? await productsRes.json() : [];
    const orders = ordersRes.ok ? await ordersRes.json() : [];

    console.log('Usuarios:', users);
    console.log('Productos:', products);
    console.log('Órdenes:', orders);
    
    // Stats
    document.getElementById('total-users').textContent = users.length || 0;
    document.getElementById('total-products').textContent = products.length || 0;
    document.getElementById('total-orders').textContent = orders.length || 0;
    
    const revenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
    document.getElementById('total-revenue').textContent = `$${revenue.toFixed(2)}`;
    
    // Users table
    const usersList = document.getElementById('users-list');
    if (users.length === 0) {
      usersList.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">📭 No hay usuarios</td></tr>';
    } else {
      usersList.innerHTML = users.map(u => `
        <tr>
          <td>${u.id}</td>
          <td>${u.email}</td>
          <td>${u.name || '-'}</td>
          <td>
            <select class="role-select" onchange="updateUserRole(${u.id}, this.value)">
              <option value="marketplace" ${u.role === 'marketplace' ? 'selected' : ''}>Marketplace</option>
              <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
            </select>
          </td>
          <td><span class="badge badge-active">${u.status || 'active'}</span></td>
          <td>${new Date(u.created_at).toLocaleDateString()}</td>
          <td>
            <button onclick="deleteAdminUser(${u.id})" class="btn btn-sm btn-danger">🗑️</button>
          </td>
        </tr>
      `).join('');
    }
    
    // Products table
    const productsList = document.getElementById('products-list');
    if (products.length === 0) {
      productsList.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">📭 No hay productos</td></tr>';
    } else {
      productsList.innerHTML = products.map(p => `
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>$${parseFloat(p.price).toFixed(2)}</td>
          <td>${p.stock}</td>
          <td>${p.category || '-'}</td>
          <td><span class="badge badge-active">${p.status || 'active'}</span></td>
          <td>
            <button onclick="deleteAdminProduct(${p.id})" class="btn btn-sm btn-danger">🗑️</button>
          </td>
        </tr>
      `).join('');
    }
    
    // Orders table
    const ordersList = document.getElementById('orders-list');
    if (orders.length === 0) {
      ordersList.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">📭 No hay órdenes</td></tr>';
    } else {
      ordersList.innerHTML = orders.map(o => `
        <tr>
          <td>${o.id}</td>
          <td>${o.user_email || '-'}</td>
          <td>$${parseFloat(o.total_amount).toFixed(2)}</td>
          <td>
            <select onchange="updateOrderStatus(${o.id}, this.value)">
              <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pendiente</option>
              <option value="paid" ${o.status === 'paid' ? 'selected' : ''}>Pagado</option>
              <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Enviado</option>
              <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Entregado</option>
            </select>
          </td>
          <td>${new Date(o.created_at).toLocaleDateString()}</td>
        </tr>
      `).join('');
    }
    
  } catch (error) {
    console.error('❌ Error cargando datos admin:', error);
    showNotification('❌ Error cargando datos', 'error');
  }
}

// Actualizar rol de usuario
async function updateUserRole(userId, newRole) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    
    if (response.ok) {
      showNotification(`✅ Rol actualizado a ${newRole}`);
      loadAdminData();
    }
  } catch (error) {
    showNotification('❌ Error actualizando rol', 'error');
  }
}

// Eliminar usuario desde admin
async function deleteAdminUser(userId) {
  if (confirm('¿Deseas eliminar este usuario permanentemente?')) {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
      if (response.ok) {
        showNotification('✅ Usuario eliminado');
        loadAdminData();
      } else {
        showNotification('❌ Error eliminando usuario', 'error');
      }
    } catch (error) {
      showNotification('❌ Error eliminando usuario', 'error');
    }
  }
}

// Eliminar producto desde admin
async function deleteAdminProduct(productId) {
  if (confirm('¿Deseas eliminar este producto permanentemente?')) {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, { method: 'DELETE' });
      if (response.ok) {
        showNotification('✅ Producto eliminado');
        loadAdminData();
      } else {
        showNotification('❌ Error eliminando producto', 'error');
      }
    } catch (error) {
      showNotification('❌ Error eliminando producto', 'error');
    }
  }
}

// Actualizar estado de orden
async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (response.ok) {
      showNotification(`✅ Estado actualizado a ${newStatus}`);
      loadAdminData();
    }
  } catch (error) {
    showNotification('❌ Error actualizando estado', 'error');
  }
}

function switchAdminTab(tab) {
  document.querySelectorAll('#admin-section .tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(tab + '-tab').style.display = 'block';
  
  document.querySelectorAll('#admin-section .nav-btn').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
}

// ======================== VENDOR DASHBOARD ========================
async function loadVendorData() {
  try {
    const products = await fetch(`${API_URL}/products`).then(r => r.json());
    allProducts = products;
    
    const categories = await fetch(`${API_URL}/categories`).then(r => r.json());
    allCategories = categories;
    
    // Populate category dropdown for add product form
    const catSelect = document.getElementById('prod-category');
    catSelect.innerHTML = '<option value="">-- Selecciona una categoría --</option>' + 
      allCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    // Mi productos (solo del vendedor actual)
    const myProducts = products.filter(p => p.seller_id === currentUser.id);
    renderVendorProducts(myProducts);
    
    // Todos los productos visible para marketplace (mostrarlos directamente)
    renderVendorMarketplaceProducts(products);
    
  } catch (error) {
    console.error('Error cargando datos vendedor:', error);
  }
}

function renderVendorProducts(products) {
  const container = document.getElementById('vendor-products');
  
  if (products.length === 0) {
    container.innerHTML = '<p style="text-align:center; padding: 20px;">📦 No tienes productos creados aún</p>';
    return;
  }
  
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="https://via.placeholder.com/200?text=${encodeURIComponent(p.name)}" alt="${p.name}">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="price">💰 $${parseFloat(p.price).toFixed(2)}</p>
        <p class="stock">📦 Stock: ${p.stock}</p>
        <p class="description">${p.description || 'Sin descripción'}</p>
      </div>
      <div class="card-actions">
        <button onclick="editProduct(${p.id})" class="btn btn-sm btn-primary">✏️ Editar</button>
        <button onclick="deleteVendorProduct(${p.id})" class="btn btn-sm btn-danger">🗑️ Eliminar</button>
      </div>
    </div>
  `).join('');
}

// Marketplace view - mostrar todos los productos (para Vendor)
function renderVendorMarketplaceProducts(products = allProducts) {
  const container = document.getElementById('vendor-shop-products');
  
  if (products.length === 0) {
    container.innerHTML = '<p style="text-align:center; padding: 20px;">📭 No hay productos disponibles</p>';
    return;
  }
  
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="https://via.placeholder.com/200?text=${encodeURIComponent(p.name)}" alt="${p.name}">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="description">${p.description || 'Sin descripción'}</p>
        <p class="price">💰 $${parseFloat(p.price).toFixed(2)}</p>
        <p class="stock ${p.stock > 0 ? 'available' : 'out-of-stock'}">
          📦 ${p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}
        </p>
      </div>
      <button onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price})" 
              class="btn btn-primary btn-block" 
              ${p.stock <= 0 ? 'disabled' : ''}>
        🛒 Añadir al Carrito
      </button>
    </div>
  `).join('');
}

// Marketplace view - mostrar todos los productos
function renderMarketplaceProducts(products = allProducts) {
  const container = document.getElementById('shop-products');
  
  if (products.length === 0) {
    container.innerHTML = '<p style="text-align:center; padding: 20px;">📭 No hay productos disponibles</p>';
    return;
  }
  
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-image">
        <img src="https://via.placeholder.com/200?text=${encodeURIComponent(p.name)}" alt="${p.name}">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="description">${p.description || 'Sin descripción'}</p>
        <p class="price">💰 $${parseFloat(p.price).toFixed(2)}</p>
        <p class="stock ${p.stock > 0 ? 'available' : 'out-of-stock'}">
          📦 ${p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}
        </p>
      </div>
      <button onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price})" 
              class="btn btn-primary btn-block" 
              ${p.stock <= 0 ? 'disabled' : ''}>
        🛒 Añadir al Carrito
      </button>
    </div>
  `).join('');
}

async function handleAddProduct(e) {
  e.preventDefault();
  const product = {
    name: document.getElementById('prod-name').value,
    price: parseFloat(document.getElementById('prod-price').value),
    category_id: document.getElementById('prod-category').value,
    stock: parseInt(document.getElementById('prod-stock').value),
    description: document.getElementById('prod-description').value
  };
  
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    
    if (response.ok) {
      showNotification('✅ Producto creado exitosamente');
      document.getElementById('product-form').reset();
      loadVendorData();
    }
  } catch (error) {
    showNotification('❌ Error creando producto', 'error');
  }
}

function editProduct(id) {
  showNotification('📝 Funcionalidad de edición proximamente');
}

async function deleteVendorProduct(id) {
  if (confirm('¿Deseas eliminar este producto? Esta acción no se puede deshacer.')) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        showNotification('✅ Producto eliminado correctamente');
        loadVendorData(); // Recargar datos automáticamente
      } else {
        showNotification('❌ Error eliminando el producto', 'error');
      }
    } catch (error) {
      showNotification('❌ Error eliminando el producto', 'error');
    }
  }
}

function switchVendorTab(tab) {
  document.querySelectorAll('#vendor-section .tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(tab + '-tab').style.display = 'block';
  
  document.querySelectorAll('#vendor-section .nav-btn').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
  
  // Cargar datos específicos cuando se navega a la tienda
  if (tab === 'shop') {
    loadMarketplaceShop();
  }
}

// Cargar tienda marketplace
async function loadMarketplaceShop() {
  try {
    const products = await fetch(`${API_URL}/products`).then(r => r.json());
    allProducts = products;
    
    const categories = await fetch(`${API_URL}/categories`).then(r => r.json());
    allCategories = categories;
    
    // Populate category filter
    const catFilter = document.getElementById('vendor-category-filter');
    if (catFilter) {
      catFilter.innerHTML = '<option value="">Todas las categorías</option>' + 
        allCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
    
    // Mostrar todos los productos sin escribir (cargar inicialmente)
    renderVendorMarketplaceProducts(products);
  } catch (error) {
    console.error('Error cargando tienda:', error);
  }
}

function filterMarketplaceProducts() {
  const search = document.getElementById('vendor-search-products').value.toLowerCase();
  const category = document.getElementById('vendor-category-filter').value;
  
  const filtered = allProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search) || 
                       (p.description && p.description.toLowerCase().includes(search));
    const matchCategory = !category || p.category_id == category;
    return matchSearch && matchCategory && p.stock > 0;
  });
  
  renderVendorMarketplaceProducts(filtered);
}

// ======================== CLIENT DASHBOARD ========================
async function loadClientData() {
  try {
    const [products, categories, cart] = await Promise.all([
      fetch(`${API_URL}/products`).then(r => r.json()),
      fetch(`${API_URL}/categories`).then(r => r.json()),
      fetch(`${API_URL}/cart`).then(r => r.json()).then(c => {
        cartId = c.id;
        currentCart = c;
        return c;
      })
    ]);
    
    allProducts = products;
    allCategories = categories;
    
    // Populate category filter
    const catFilter = document.getElementById('category-filter');
    catFilter.innerHTML = '<option value="">Todas las categorías</option>' + 
      allCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    // Render shop products
    renderShopProducts(products);
    renderCartTable();
    
  } catch (error) {
    console.error('Error cargando datos cliente:', error);
  }
}

function renderShopProducts(products = allProducts) {
  const container = document.getElementById('shop-products');
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="https://via.placeholder.com/200?text=${p.name}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="description">${p.description || p.category}</p>
      <p class="price">$${p.price}</p>
      <p class="stock ${p.stock > 0 ? 'available' : 'out-of-stock'}">
        ${p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}
      </p>
      <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})" 
              class="btn btn-primary btn-block" 
              ${p.stock <= 0 ? 'disabled' : ''}>
        🛒 Añadir al Carrito
      </button>
    </div>
  `).join('');
}

function filterProducts() {
  const search = document.getElementById('search-products').value.toLowerCase();
  const category = document.getElementById('category-filter').value;
  
  const filtered = allProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search) || 
                       (p.description && p.description.toLowerCase().includes(search));
    const matchCategory = !category || p.category_id == category;
    return matchSearch && matchCategory;
  });
  
  renderShopProducts(filtered);
}

async function renderCartTable() {
  if (!currentCart) return;
  
  const items = currentCart.items || [];
  const tbody = document.getElementById('cart-items-list');
  
  tbody.innerHTML = items.map(item => `
    <tr>
      <td>${item.product_name}</td>
      <td>$${item.price}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" 
               onchange="updateQuantity(${item.id}, this.value)" class="qty-input">
      </td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
      <td>
        <button onclick="removeFromCart(${item.id})" class="btn btn-sm btn-danger">🗑️</button>
      </td>
    </tr>
  `).join('');
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

async function addToCart(productId, productName, price) {
  try {
    const response = await fetch(`${API_URL}/cart/${cartId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity: 1, price })
    });
    
    if (response.ok) {
      socket.emit('add_to_cart', { cartId, productId, quantity: 1, price });
    }
  } catch (error) {
    showNotification('❌ Error añadiendo producto', 'error');
  }
}

async function updateQuantity(itemId, quantity) {
  try {
    await fetch(`${API_URL}/cart/${cartId}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: parseInt(quantity) })
    });
    
    socket.emit('update_item', { cartId, itemId, quantity });
  } catch (error) {
    showNotification('❌ Error actualizando cantidad', 'error');
  }
}

async function removeFromCart(itemId) {
  try {
    await fetch(`${API_URL}/cart/${cartId}/items/${itemId}`, { method: 'DELETE' });
    socket.emit('remove_from_cart', { cartId, itemId });
  } catch (error) {
    showNotification('❌ Error removiendo item', 'error');
  }
}

async function clearCart() {
  if (confirm('¿Vaciar carrito completamente?')) {
    try {
      await fetch(`${API_URL}/cart/${cartId}`, { method: 'DELETE' });
      socket.emit('clear_cart', { cartId });
    } catch (error) {
      showNotification('❌ Error vaciando carrito', 'error');
    }
  }
}

async function checkout() {
  if (!currentCart || !currentCart.items || currentCart.items.length === 0) {
    showNotification('⚠️ El carrito está vacío', 'warning');
    return;
  }
  
  const total = currentCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: currentUser.id,
        cart_id: cartId,
        total_amount: total,
        status: 'pending'
      })
    });
    
    if (response.ok) {
      showNotification('✅ ¡Compra realizada exitosamente!');
      await clearCart();
      switchClientTab('orders');
    }
  } catch (error) {
    showNotification('❌ Error procesando compra', 'error');
  }
}

function switchClientTab(tab) {
  document.querySelectorAll('#client-section .tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(tab + '-tab').style.display = 'block';
  
  document.querySelectorAll('#client-section .nav-btn').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
}

// ======================== FUNCIONES AUXILIARES ========================
async function initializeCart() {
  try {
    const response = await fetch(`${API_URL}/cart`, { method: 'POST' });
    const cart = await response.json();
    cartId = cart.id;
    currentCart = cart;
  } catch (error) {
    console.error('Error inicializando carrito:', error);
  }
}

async function loadCart() {
  try {
    const response = await fetch(`${API_URL}/cart/${cartId}`);
    const cart = await response.json();
    currentCart = cart;
    renderCartTable();
  } catch (error) {
    console.error('Error cargando carrito:', error);
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 3000);
}
