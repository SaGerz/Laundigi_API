const db = require('../config/db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken.js')

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

    const userId = userResult.insertId;

    const token = generateToken({
        id: userId,
        name,
        email,
        role: role || 'owner',
        laundry_id: laundryId
    });

    await connection.commit();

    res.status(201).json({
        message: "Register success",
        token,
        user: {
            id: userId,
            name,
            email,
            role: role || 'owner',
            laundry_id: laundryId
        }
    });

    } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Register failed" });
    } finally {
    connection.release();
    }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // cek user
    const [rows] = await db.query(
      `SELECT id, name, email, password_hash, role, laundry_id
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Email not found"
      });
    }

    const user = rows[0];

    // cek password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong password"
      });
    }

    // generate token
    const token = generateToken(user);

    res.json({
      message: "Login success",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        laundry_id: user.laundry_id
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};