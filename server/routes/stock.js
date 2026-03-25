const express = require('express');
const {
  getStockLogs,
  getStockSummary
} = require('../controllers/stockController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/logs', getStockLogs);
router.get('/summary', getStockSummary);

module.exports = router;
