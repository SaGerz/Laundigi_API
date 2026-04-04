const db = require('../config/db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken.js');
const { registerService } = require('../services/authServices.js');

exports.register = async (req, res) => {
    const connection = await db.getConnection();

    try {
    await connection.beginTransaction();

    const result = await registerService(req.body, connection);

    const token = generateToken({
        id: result.userId,
        name: result.name,
        email: result.email,
        role: result.role || 'owner',
        laundry_id: result.laundryId
    });

    await connection.commit();

    res.status(201).json({
        message: "Register success",
        token,
        user: {
          id: result.userId,
          name: result.name,
          email: result.email,
          role: result.role || 'owner',
          laundry_id: result.laundryId
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