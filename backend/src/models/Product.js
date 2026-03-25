const pool = require('../config/database');

class Product {
  static async getAll() {
    try {
      const result = await pool.query('SELECT * FROM products ORDER BY id');
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw error;
    }
  }

  static async create(name, price, description, image) {
    try {
      const result = await pool.query(
        'INSERT INTO products (name, price, description, image) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, price, description, image]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creando producto:', error);
      throw error;
    }
  }

  static async update(id, name, price, description, image) {
    try {
      const result = await pool.query(
        'UPDATE products SET name = $1, price = $2, description = $3, image = $4 WHERE id = $5 RETURNING *',
        [name, price, description, image, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await pool.query('DELETE FROM products WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  }
}

module.exports = Product;
