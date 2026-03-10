const express = require('express');
const router = express.Router();
const { createService, getServices } = require('../controllers/serviceController');

router.post("/", createService);
router.get("/", getServices);

module.exports = router;