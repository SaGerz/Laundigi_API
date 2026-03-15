const pool = require("../config/db");

exports.createOrder = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { customer, package_type, items } = req.body;
    const laundry_id = req.user.laundry_id;


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
        `SELECT price_per_kg FROM services WHERE id = ? AND laundry_id = ?`,
        [item.service_id, laundry_id]
      );

      if (serviceRows.length === 0) {
        throw new Error("Service not found or invalid");
      }

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

    res.status(201).json({
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

exports.getOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    console.log("Masuk Order");
    const laundry_id = req.user.laundry_id;
    console.log(laundry_id);

    const[orders] = await connection.query(
      `SELECT 
        o.id,
        c.name,
        c.phone,
        o.package_type,
        o.total_price,
        o.status,
        o.received_at
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.laundry_id = ?
      ORDER BY o.received_at DESC
      `, [laundry_id]
    );

    const formatedOrders = orders.map(order => ({
      ...order,
      total_price: parseFloat(order.total_price)
    }))
    
    res.status(200).json(formatedOrders);

  } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
  }
}
