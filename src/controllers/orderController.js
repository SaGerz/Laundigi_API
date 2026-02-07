const pool = require("../config/db");

exports.createOrder = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { laundry_id, customer, package_type, items } = req.body;

    await connection.beginTransaction();

    // 1. Insert customer
    const [customerResult] = await connection.query(
      `INSERT INTO customers (laundry_id, name, phone)
       VALUES (?, ?, ?)`,
      [laundry_id, customer.name, customer.phone]
    );

    const customerId = customerResult.insertId;

    // 2. Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (laundry_id, customer_id, status, received_at, package_type)
       VALUES (?, ?, 'DITERIMA', NOW(), ?)`,
      [laundry_id, customerId, package_type]
    );

    const orderId = orderResult.insertId;

    let total = 0;

    // 3. Insert order items
    for (const item of items) {

      const [serviceRows] = await connection.query(
        `SELECT price_per_kg FROM services WHERE id = ?`,
        [item.service_id]
      );

      const pricePerKg = serviceRows[0].price_per_kg;
      const subtotal = pricePerKg * item.weight;

      await connection.query(
        `INSERT INTO order_items
        (order_id, service_id, weight, price_per_kg, subtotal, notes)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            orderId,
            item.service_id,
            item.weight,
            pricePerKg,
            subtotal,
            item.notes || null
        ]
      );

      total += subtotal;
    }

    // 4. Express fee
    if (package_type === "EXPRESS") {
      total += 3000;
    }

    // 5. Update total price
    await connection.query(
      `UPDATE orders SET total_price = ? WHERE id = ?`,
      [total, orderId]
    );

    await connection.commit();

    res.json({
      message: "Order created successfully",
      order_id: orderId
    });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  } finally {
    connection.release();
  }
};
