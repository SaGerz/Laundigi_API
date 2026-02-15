const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const connection = await db.getConnection();
    const activeUntil = new Date();
    activeUntil.setMonth(activeUntil.getMonth() + 1);

    try {
    await connection.beginTransaction();

    const {
        name,
        email,
        password,
        role,
        laundry_name,
        package,
        address,
        phone
    } = req.body;


    if (!name || !email || !password || !role || !laundry_name || !package || !address || !phone) {
        return res.status(400).json({
        message: "Required fields missing"
        });
    }

    // cek email sudah terdaftar
    const [existingUser] = await connection.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );

    if (existingUser.length > 0) {
        return res.status(400).json({
        message: "Email already registered"
        });
    }

    // insert laundry
    const [laundryResult] = await connection.query(
        `INSERT INTO laundries
        (name, package, active_until, address, phone)
        VALUES (?, ?, ?, ?, ?)`,
        [laundry_name, package, activeUntil, address, phone]
    );

    const laundryId = laundryResult.insertId;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user owner
    const [userResult] = await connection.query(
        `INSERT INTO users
        (name, email, password_hash, role, laundry_id)
        VALUES (?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, role || 'owner', laundryId]
    );

    await connection.commit();

    res.status(201).json({
        message: "Register success",
        user_id: userResult.insertId,
        laundry_id: laundryId
    });

    } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Register failed" });
    } finally {
    connection.release();
    }
};