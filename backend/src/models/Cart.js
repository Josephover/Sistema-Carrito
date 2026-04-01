const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Cart {
  static async createCart() {
    try {
      const cartId = uuidv4();
      const result = await pool.query(
        'INSERT INTO carts (id, user_id, total_price, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [cartId, null, 0]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creando carrito:', error);
      throw error;
    }
  }

  static async getCart(cartId) {
    try {
      const result = await pool.query(
        `SELECT c.id, c.user_id, c.total_price, c.created_at, c.updated_at,
                COALESCE(
                  json_agg(json_build_object(
                    'id', ci.id, 
                    'product_id', ci.product_id, 
                    'quantity', ci.quantity, 
                    'price', ci.price,
                    'product_name', p.name,
                    'product_image', p.image_url,
                    'product_stock', p.stock
                  )) FILTER (WHERE ci.id IS NOT NULL), 
                  '[]'::json
                ) as items 
         FROM carts c 
         LEFT JOIN cart_items ci ON c.id = ci.cart_id
         LEFT JOIN products p ON ci.product_id = p.id
         WHERE c.id = $1 
         GROUP BY c.id`,
        [cartId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      throw error;
    }
  }

  static async addItem(cartId, productId, quantity, price) {
    try {
      const result = await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
        [cartId, productId, quantity, price]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error añadiendo item al carrito:', error);
      throw error;
    }
  }

  static async updateItem(cartId, itemId, quantity) {
    try {
      const result = await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND cart_id = $3 RETURNING *',
        [quantity, itemId, cartId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error actualizando item:', error);
      throw error;
    }
  }

  static async removeItem(cartId, itemId) {
    try {
      await pool.query(
        'DELETE FROM cart_items WHERE id = $1 AND cart_id = $2',
        [itemId, cartId]
      );
      return true;
    } catch (error) {
      console.error('Error eliminando item:', error);
      throw error;
    }
  }

  static async clearCart(cartId) {
    try {
      await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
      return true;
    } catch (error) {
      console.error('Error vaciando carrito:', error);
      throw error;
    }
  }

  // Obtener o crear carrito para un usuario
  static async getOrCreateUserCart(userId) {
    try {
      // Buscar si existe carrito
      let result = await pool.query(
        'SELECT * FROM carts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
        [userId]
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      }

      // Crear nuevo carrito si no existe
      const cartId = uuidv4();
      result = await pool.query(
        'INSERT INTO carts (id, user_id, total_price) VALUES ($1, $2, 0) RETURNING *',
        [cartId, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error obteniendo/creando carrito:', error);
      throw error;
    }
  }

  // Actualizar total del carrito
  static async updateCartTotal(cartId) {
    try {
      const result = await pool.query(
        `UPDATE carts 
         SET total_price = COALESCE((SELECT SUM(price * quantity) FROM cart_items WHERE cart_id = $1), 0),
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [cartId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error actualizando total:', error);
      throw error;
    }
  }
}

module.exports = Cart;
