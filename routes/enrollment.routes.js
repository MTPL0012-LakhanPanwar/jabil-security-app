const express = require('express');
const router = express.Router();
const {
  scanEntry,
  scanExit
} = require('../controllers/enrollment.controller');

// Public routes (for mobile app)
router.post('/scan-entry', scanEntry);
router.post('/scan-exit', scanExit);

module.exports = router;
