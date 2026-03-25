const { pool } = require('../config/database');

class Category {
  static async getAll() {
    const query = 'SELECT id, name, description, slug, active, created_at FROM categories WHERE active = true ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = 'SELECT id, name, description, slug, active, created_at FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(name, description, slug) {
    const query = `
      INSERT INTO categories (name, description, slug, active, created_at, updated_at)
      VALUES ($1, $2, $3, true, NOW(), NOW())
      RETURNING id, name, description, slug, active, created_at
    `;
    const result = await pool.query(query, [name, description, slug]);
    return result.rows[0];
  }

  static async update(id, name, description, slug, active) {
    const query = `
      UPDATE categories
      SET name = COALESCE($2, name),
          description = COALESCE($3, description),
          slug = COALESCE($4, slug),
          active = COALESCE($5, active),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, description, slug, active, created_at
    `;
    const result = await pool.query(query, [id, name, description, slug, active]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = Category;
