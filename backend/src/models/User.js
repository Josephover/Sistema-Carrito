const pool = require('../config/database');
const crypto = require('crypto');

class User {
  // Hash contraseña
  static hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // Obtener todos
  static async getAll() {
    const query = 'SELECT id, email, name, status, role, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  // Obtener por ID
  static async getById(id) {
    const query = 'SELECT id, email, name, status, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Obtener por email
  static async getByEmail(email) {
    const query = 'SELECT id, email, name, status, role, created_at FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Registrar nuevo usuario
  static async register(email, name, password) {
    // Verificar si email ya existe
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      throw new Error('El email ya está registrado');
    }

    const hashedPassword = this.hashPassword(password);
    const role = 'marketplace'; // Rol por defecto: puede vender y comprar

    const query = `
      INSERT INTO users (email, name, password, role, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'active', NOW(), NOW())
      RETURNING id, email, name, role, status, created_at
    `;
    const result = await pool.query(query, [email, name, hashedPassword, role]);
    return result.rows[0];
  }

  // Login
  static async login(email, password) {
    const hashedPassword = this.hashPassword(password);
    const query = 'SELECT id, email, name, role, status FROM users WHERE email = $1 AND password = $2';
    const result = await pool.query(query, [email, hashedPassword]);
    
    if (result.rows.length === 0) {
      throw new Error('Email o contraseña incorrectos');
    }

    return result.rows[0];
  }

  // Crear usuario (para admin)
  static async create(email, name, password) {
    return this.register(email, name, password);
  }

  // Actualizar usuario (email, nombre, estado, rol)
  static async update(id, email, name, status, role) {
    const query = `
      UPDATE users
      SET email = COALESCE($2, email),
          name = COALESCE($3, name),
          status = COALESCE($4, status),
          role = COALESCE($5, role),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, name, role, status, created_at
    `;
    const result = await pool.query(query, [id, email, name, status, role]);
    return result.rows[0];
  }

  // Cambiar rol (método específico para cambiar solo el rol)
  static async updateRole(id, role) {
    const rolesValidos = ['admin', 'marketplace'];
    if (!rolesValidos.includes(role)) {
      throw new Error('Rol inválido. Roles válidos: admin, marketplace');
    }

    const query = `
      UPDATE users
      SET role = $2,
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, name, role, status, created_at
    `;
    const result = await pool.query(query, [id, role]);
    if (result.rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }
    return result.rows[0];
  }

  // Eliminar
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = User;
