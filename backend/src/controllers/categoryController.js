const Category = require('../models/Category');

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const category = await Category.getById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, slug } = req.body;
    const category = await Category.create(name, description, slug);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const category = await Category.update(req.params.id, name, description, status);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Category.delete(req.params.id);
    res.status(200).json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
