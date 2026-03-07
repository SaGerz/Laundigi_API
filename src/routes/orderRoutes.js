const express = require("express");
const router = express.Router();
const { createOrder, getOrder } = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getOrder);

module.exports = router;
