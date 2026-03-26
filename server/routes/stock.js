const express = require('express');
const multer = require('multer');
const {
  getStockLogs,
  getStockSummary,
  getAllStockItems,
  createStockItem,
  updateStockItem
} = require('../controllers/stockController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for FormData handling
const upload = multer({ dest: 'uploads/' });

router.use(authenticate);

// Stock management routes
router.get('/', getAllStockItems);
router.post('/', upload.none(), createStockItem); // Handle FormData without files
router.patch('/:id', updateStockItem);

// Existing routes
router.get('/logs', getStockLogs);
router.get('/summary', getStockSummary);

module.exports = router;
