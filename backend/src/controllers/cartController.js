const Cart = require('../models/Cart');
const pool = require('../config/database');

exports.createCart = async (req, res) => {
  try {
    const cart = await Cart.createCart();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error creando carrito' });
  }
};

// Obtener o crear carrito del usuario autenticado
exports.getUserCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID requerido' });
    }

    const cart = await Cart.getOrCreateUserCart(parseInt(userId));
    const fullCart = await Cart.getCart(cart.id);
    
    res.status(200).json(fullCart);
  } catch (error) {
    console.error('Error obteniendo carrito del usuario:', error);
    res.status(500).json({ error: error.message || 'Error obteniendo carrito' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.getCart(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo carrito' });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity, price } = req.body;
    
    if (!productId || !quantity || !price) {
      return res.status(400).json({ error: 'productId, quantity y price son requeridos' });
    }
    
    // Validar que el item no exista ya en el carrito
    const checkResult = await pool.query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );

    if (checkResult.rows.length > 0) {
      // Si existe, actualizar cantidad
      const newQuantity = checkResult.rows[0].quantity + parseInt(quantity);
      const item = await Cart.updateItem(cartId, checkResult.rows[0].id, newQuantity);
      await Cart.updateCartTotal(cartId);
      return res.status(200).json(item);
    }

    const item = await Cart.addItem(cartId, productId, quantity, price);
    await Cart.updateCartTotal(cartId);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error añadiendo item:', error);
    res.status(500).json({ error: error.message || 'Error añadiendo item al carrito' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;
    const item = await Cart.updateItem(cartId, itemId, quantity);
    await Cart.updateCartTotal(cartId);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando item' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    await Cart.removeItem(cartId, itemId);
    await Cart.updateCartTotal(cartId);
    res.status(200).json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando item' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    await Cart.clearCart(cartId);
    await Cart.updateCartTotal(cartId);
    res.status(200).json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ error: 'Error vaciando carrito' });
  }
};
