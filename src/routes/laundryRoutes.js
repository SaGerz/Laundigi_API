const express = require("express");
const router = express.Router();
const { laundryController } = require("../controllers/laundryController");

router.post("/", laundryController);

module.exports = router;
