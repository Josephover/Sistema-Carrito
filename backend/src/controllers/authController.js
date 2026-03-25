const User = require('../models/User');

// Registro de nuevo usuario
exports.register = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    // Validaciones
    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    if (password.length < 5) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 5 caracteres' });
    }

    // Registrar usuario
    const user = await User.register(email, name, password);
    
    res.status(201).json({
      message: 'Registro exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Ingreso de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Verificar credenciales
    const user = await User.login(email, password);

    res.status(200).json({
      message: 'Ingreso exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
