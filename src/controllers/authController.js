const db = require('../config/db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken.js');
const { registerService, loginServices } = require('../services/authServices.js');

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
    const result = await loginServices(req.body, db)

    res.json({
      message: "Login success",
      token: result.token,
      user: {
        id: result.id,
        name: result.name,
        role: result.role,
        laundry_id: result.laundry_id
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};