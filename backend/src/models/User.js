const { pool } = require('../config/database');

class User {
  static async getAll() {
    const query = 'SELECT id, email, name, status, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = 'SELECT id, email, name, status, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(email, name, password) {
    const query = `
      INSERT INTO users (email, name, status, created_at, updated_at)
      VALUES ($1, $2, 'active', NOW(), NOW())
      RETURNING id, email, name, status, created_at
    `;
    const result = await pool.query(query, [email, name]);
    return result.rows[0];
  }

  static async update(id, email, name, status) {
    const query = `
      UPDATE users
      SET email = COALESCE($2, email),
          name = COALESCE($3, name),
          status = COALESCE($4, status),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, name, status, created_at
    `;
    const result = await pool.query(query, [id, email, name, status]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = User;
