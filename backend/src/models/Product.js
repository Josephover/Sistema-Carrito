const pool = require('../config/database');

class Product {
  static async getAll() {
    try {
      const query = `
        SELECT p.id, p.name, p.description, p.price, p.category_id, p.seller_id, 
               p.stock, p.image_url, p.status, p.created_at, p.updated_at,
               c.name as category, u.name as seller_name, u.email as seller_email
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN users u ON p.seller_id = u.id
        ORDER BY p.id DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT p.id, p.name, p.description, p.price, p.category_id, p.seller_id, 
               p.stock, p.image_url, p.status, p.created_at, p.updated_at,
               c.name as category, u.name as seller_name, u.email as seller_email
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN users u ON p.seller_id = u.id
        WHERE p.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw error;
    }
  }

  static async create(name, price, description, category_id, seller_id, stock, image_url = null) {
    try {
      const result = await pool.query(
        `INSERT INTO products (name, price, description, category_id, seller_id, stock, image_url, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', NOW(), NOW()) 
         RETURNING *`,
        [name, price, description, category_id, seller_id, stock, image_url]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creando producto:', error);
      throw error;
    }
  }

  static async update(id, name, price, description, category_id, stock, image_url = null) {
    try {
      let query, params;
      
      if (image_url) {
        query = `UPDATE products 
                 SET name = $1, price = $2, description = $3, category_id = $4, stock = $5, image_url = $6, updated_at = NOW()
                 WHERE id = $7 
                 RETURNING *`;
        params = [name, price, description, category_id, stock, image_url, id];
      } else {
        query = `UPDATE products 
                 SET name = $1, price = $2, description = $3, category_id = $4, stock = $5, updated_at = NOW()
                 WHERE id = $6 
                 RETURNING *`;
        params = [name, price, description, category_id, stock, id];
      }
      
      const result = await pool.query(query, params);
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
