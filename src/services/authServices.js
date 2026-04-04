const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

const registerService = async (body, connection) => {
     const {
            name,
            email,
            password,
            role,
            laundry_name,
            package,
            address,
            phone
        } = body;
    
    
        if (!name || !email || !password || !role || !laundry_name || !package || !address || !phone) {
            throw new Error("Required fields missing");
        }
    
        // cek email sudah terdaftar
        const [existingUser] = await connection.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );
    
        if (existingUser.length > 0) {
            throw new Error("Email already registered");
        }
    
        
        const activeUntil = new Date();
        activeUntil.setMonth(activeUntil.getMonth() + 1);

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

         return {
            userId: userResult.insertId,
            laundryId: laundryResult.insertId,
            name,
            email,
            role: role || 'owner'
        };
}

const loginServices = async (body, db) => {
    const {
        email, 
        password
    } = body;
    
    // cek user
    const [rows] = await db.query(
      `SELECT id, name, email, password_hash, role, laundry_id
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      throw new Error("Email not found");
    }

    const user = rows[0];

    // cek password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new Error("Wrong password");
    }
    
    // generate token
    const token = generateToken(user);

     return {
        message: "Login success",
        token,
        id: user.id,
        name: user.name,
        role: user.role,
        laundry_id: user.laundry_id
    }
}

module.exports = {
    registerService,
    loginServices
}