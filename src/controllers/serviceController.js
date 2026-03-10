const db = require('../config/db.js');

exports.createService = async (req, res) => {
    try {
        const laundry_id = req.user.laundry_id;
        const { services } = req.body;

        if (!services || services.length === 0) {
            return res.status(400).json({ message: "Services data required" });
        }
        
        for (const service of services) {

            await db.query(
                `INSERT INTO services
                (laundry_id, name, price_per_kg, express_multiplier, created_at)
                VALUES (?, ?, ?, ?, NOW())`,
                [
                    laundry_id,
                    service.name,
                    service.price_per_kg,
                    service.express_multiplier || null
                ]
            );
        }

        res.status(201).json({
            message: "Services created successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create services" });
    }
}

exports.getServices = async (req, res) => {
  try {
    const laundry_id = req.user.laundry_id;

    const [services] = await db.query(
      `SELECT id, name, price_per_kg 
       FROM services 
       WHERE laundry_id = ?`,
      [laundry_id]
    );

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};