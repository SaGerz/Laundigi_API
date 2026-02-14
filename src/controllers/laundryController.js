// controllers/laundryController.js
const db = require('../config/db');

exports.createLaundry = async (req, res) => {
    try {
        const { name, package, active_until, address, phone } = req.body;

        const [result] = await db.query(
            `INSERT INTO laundries (name, package, active_until, address, phone)
             VALUES (?, ?, ?, ?, ?)`,
            [name, package, active_until, address, phone]
        );

        res.status(201).json({
            message: 'Laundry created',
            laundry_id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};