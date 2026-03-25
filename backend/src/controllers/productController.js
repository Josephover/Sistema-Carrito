const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error en getAll:', error);
    res.status(500).json({ error: 'Error obteniendo productos', details: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({ error: 'Error obteniendo productos', details: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo producto', details: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category_id, stock } = req.body;
    const seller_id = req.body.seller_id || 1; // Por defecto vendedor con ID 1
    
    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'Campos requeridos: name, price, category_id' });
    }

    const product = await Product.create(name, price, description, category_id, seller_id, stock || 0);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error creando producto', details: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, price, description, category_id, stock } = req.body;
    const seller_id = req.body.seller_id || 1;
    
    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'Campos requeridos: name, price, category_id' });
    }

    const product = await Product.create(name, price, description, category_id, seller_id, stock || 0);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error creando producto', details: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category_id, stock } = req.body;
    const product = await Product.update(id, name, price, description, category_id, stock);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando producto', details: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.delete(id);
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando producto', details: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.delete(id);
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando producto', details: error.message });
  }
};
