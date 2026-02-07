const express = require("express");
const cors = require("cors");
const orderRoutes = require("./src/routes/orderRoutes.js");
const laundryRoutes = require("./src/routes/laundryRoutes.js");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint : 
app.use("/orders", orderRoutes);
app.use("/laundries", laundryRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
