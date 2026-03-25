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
        'SELECT c.*, json_agg(json_build_object(\'id\', ci.id, \'product_id\', ci.product_id, \'quantity\', ci.quantity, \'price\', ci.price)) as items FROM carts c LEFT JOIN cart_items ci ON c.id = ci.cart_id WHERE c.id = $1 GROUP BY c.id',
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
}

module.exports = Cart;
