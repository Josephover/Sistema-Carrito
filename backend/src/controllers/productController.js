const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo productos' });
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
    res.status(500).json({ error: 'Error obteniendo producto' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const product = await Product.create(name, price, description, image);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creando producto' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image } = req.body;
    const product = await Product.update(id, name, price, description, image);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando producto' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.delete(id);
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando producto' });
  }
};
