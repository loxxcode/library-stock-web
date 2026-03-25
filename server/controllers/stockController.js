const StockLog = require('../models/StockLog');
const Book = require('../models/Book');

const getStockLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.query.bookId) {
      query.bookId = req.query.bookId;
    }
    
    if (req.query.action) {
      query.action = req.query.action;
    }
    
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const logs = await StockLog.find(query)
      .populate('bookId', 'title author ISBN')
      .populate('userId', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StockLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getStockSummary = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalQuantity = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const totalAvailable = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$availableQuantity' } } }
    ]);
    
    const categoryBreakdown = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: '$quantity' } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        totalQuantity: totalQuantity[0]?.total || 0,
        totalAvailable: totalAvailable[0]?.total || 0,
        totalBorrowed: (totalQuantity[0]?.total || 0) - (totalAvailable[0]?.total || 0),
        categoryBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getStockLogs,
  getStockSummary
};
