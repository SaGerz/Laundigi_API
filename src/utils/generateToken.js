const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      laundry_id: user.laundry_id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES
    }
  );
};

module.exports = generateToken;
