const User = require('../models/User');

exports.getAll = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const user = await User.create(email, name, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { email, name, status, role } = req.body;
    const user = await User.update(req.params.id, email, name, status, role);
    res.status(200).json({ message: 'Usuario actualizado', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cambiar rol de un usuario
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: 'El rol es requerido' });
    }
    const user = await User.updateRole(req.params.id, role);
    res.status(200).json({ message: 'Rol actualizado', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
