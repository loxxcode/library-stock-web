const express = require('express');
const {
  createBorrow,
  returnBook,
  getBorrows,
  getOverdueBooks,
  updateOverdueStatus
} = require('../controllers/borrowController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('admin'), createBorrow);
router.patch('/return/:id', authorize('admin'), returnBook);
router.get('/', getBorrows);
router.get('/overdue', getOverdueBooks);
router.patch('/update-overdue', authorize('admin'), updateOverdueStatus);

module.exports = router;
