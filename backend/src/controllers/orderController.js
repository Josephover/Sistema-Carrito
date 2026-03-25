const Order = require('../models/Order');

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { user_id, cart_id, total_amount, status } = req.body;
    const order = await Order.create(user_id, cart_id, total_amount, status);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { status, total_amount } = req.body;
    const order = await Order.update(req.params.id, status, total_amount);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Order.delete(req.params.id);
    res.status(200).json({ message: 'Pedido eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
