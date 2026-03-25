const pool = require('../config/database');

class Category {
  static async getAll() {
    const query = 'SELECT id, name, description, status, created_at FROM categories WHERE status = $1 ORDER BY name';
    const result = await pool.query(query, ['active']);
    return result.rows;
  }

  static async getById(id) {
    const query = 'SELECT id, name, description, status, created_at FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(name, description, slug) {
    const query = `
      INSERT INTO categories (name, description, status, created_at, updated_at)
      VALUES ($1, $2, 'active', NOW(), NOW())
      RETURNING id, name, description, status, created_at
    `;
    const result = await pool.query(query, [name, description]);
    return result.rows[0];
  }

  static async update(id, name, description, status) {
    const query = `
      UPDATE categories
      SET name = COALESCE($2, name),
          description = COALESCE($3, description),
          status = COALESCE($4, status),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, description, status, created_at
    `;
    const result = await pool.query(query, [id, name, description, status]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = Category;
