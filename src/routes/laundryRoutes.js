const express = require("express");
const router = express.Router();
const { createLaundry } = require("../controllers/laundryController");

router.post("/", createLaundry);

module.exports = router;
