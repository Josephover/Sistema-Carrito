const socketIO = require('socket.io');
const Cart = require('../models/Cart');

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  // Almacenar conexiones activas
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`👤 Cliente conectado: ${socket.id}`);

    // Evento: usuario se une a un carrito
    socket.on('join_cart', (cartId) => {
      socket.join(`cart_${cartId}`);
      activeUsers.set(socket.id, cartId);
      console.log(`👁️ Usuario ${socket.id} se unió al carrito ${cartId}`);
      
      // Notificar a otros usuarios que alguien se unió
      io.to(`cart_${cartId}`).emit('user_joined', {
        message: `Un usuario se unió al carrito`,
        activeUsers: io.sockets.adapter.rooms.get(`cart_${cartId}`).size
      });
    });

    // Evento: añadir item al carrito
    socket.on('add_to_cart', async (data) => {
      const { cartId, productId, quantity, price } = data;
      try {
        const item = await Cart.addItem(cartId, productId, quantity, price);
        io.to(`cart_${cartId}`).emit('item_added', item);
        console.log(`➕ Item añadido al carrito ${cartId}`);
      } catch (error) {
        socket.emit('error', { message: 'Error añadiendo item' });
      }
    });

    // Evento: actualizar cantidad del item
    socket.on('update_item', async (data) => {
      const { cartId, itemId, quantity } = data;
      try {
        const item = await Cart.updateItem(cartId, itemId, quantity);
        io.to(`cart_${cartId}`).emit('item_updated', item);
        console.log(`🔄 Item actualizado en carrito ${cartId}`);
      } catch (error) {
        socket.emit('error', { message: 'Error actualizando item' });
      }
    });

    // Evento: eliminar item del carrito
    socket.on('remove_from_cart', async (data) => {
      const { cartId, itemId } = data;
      try {
        await Cart.removeItem(cartId, itemId);
        io.to(`cart_${cartId}`).emit('item_removed', { itemId });
        console.log(`❌ Item eliminado del carrito ${cartId}`);
      } catch (error) {
        socket.emit('error', { message: 'Error eliminando item' });
      }
    });

    // Evento: vaciar carrito
    socket.on('clear_cart', async (cartId) => {
      try {
        await Cart.clearCart(cartId);
        io.to(`cart_${cartId}`).emit('cart_cleared', { message: 'Carrito vaciado' });
        console.log(`🗑️ Carrito ${cartId} vaciado`);
      } catch (error) {
        socket.emit('error', { message: 'Error vaciando carrito' });
      }
    });

    // Evento: obtener carrito
    socket.on('get_cart', async (cartId) => {
      try {
        const cart = await Cart.getCart(cartId);
        socket.emit('cart_data', cart);
      } catch (error) {
        socket.emit('error', { message: 'Error obteniendo carrito' });
      }
    });

    // Evento: desconexión
    socket.on('disconnect', () => {
      const cartId = activeUsers.get(socket.id);
      if (cartId) {
        io.to(`cart_${cartId}`).emit('user_left', {
          message: 'Un usuario salió del carrito',
          activeUsers: io.sockets.adapter.rooms.get(`cart_${cartId}`)?.size || 0
        });
      }
      activeUsers.delete(socket.id);
      console.log(`👤 Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
}

module.exports = { initializeSocket };
