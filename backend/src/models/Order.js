const pool = require('../config/database');

class Order {
  static async getAll() {
    const query = `
      SELECT 
        o.id,
        o.order_number,
        o.user_id,
        u.email as user_email,
        o.total_amount,
        o.status,
        o.created_at
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = `
      SELECT 
        o.id,
        o.order_number,
        o.user_id,
        u.email as user_email,
        o.total_amount,
        o.status,
        o.created_at,
        o.updated_at
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(user_id, cart_id, total_amount, status = 'pending') {
    const orderNumber = `ORD-${Date.now()}`;
    const query = `
      INSERT INTO orders (user_id, order_number, status, total_amount, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, order_number, user_id, total_amount, status, created_at
    `;
    const result = await pool.query(query, [user_id, orderNumber, status, total_amount]);
    return result.rows[0];
  }

  static async update(id, status, total_amount) {
    const query = `
      UPDATE orders
      SET status = COALESCE($2, status),
          total_amount = COALESCE($3, total_amount),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, order_number, user_id, total_amount, status, created_at
    `;
    const result = await pool.query(query, [id, status, total_amount]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM orders WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = Order;
