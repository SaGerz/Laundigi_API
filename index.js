const express = require("express");
const cors = require("cors");
const orderRoutes = require("./src/routes/orderRoutes.js");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint : 
app.use("/orders", orderRoutes);
app.use("/laundry", laundryRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
