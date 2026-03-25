const Cart = require('../models/Cart');

exports.createCart = async (req, res) => {
  try {
    const cart = await Cart.createCart();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error creando carrito' });
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
    const item = await Cart.addItem(cartId, productId, quantity, price);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error añadiendo item al carrito' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;
    const item = await Cart.updateItem(cartId, itemId, quantity);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando item' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    await Cart.removeItem(cartId, itemId);
    res.status(200).json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando item' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    await Cart.clearCart(cartId);
    res.status(200).json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ error: 'Error vaciando carrito' });
  }
};
