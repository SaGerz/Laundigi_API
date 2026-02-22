const express = require("express");
const cors = require("cors");
const orderRoutes = require("./src/routes/orderRoutes.js");
const laundryRoutes = require("./src/routes/laundryRoutes.js");
const authRoutes = require("./src/routes/authRoutes.js");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Endpoint : 
app.use("/orders", orderRoutes);
app.use("/laundries", laundryRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
