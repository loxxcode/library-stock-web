const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const StockLog = require('../models/StockLog');

const createBorrow = async (req, res) => {
  try {
    console.log('Creating borrow with data:', req.body);
    const { bookId, userId, dueDate } = req.body;

    if (!bookId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide book ID and user ID'
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    const existingBorrow = await Borrow.findOne({
      bookId,
      userId,
      status: { $in: ['borrowed', 'overdue'] }
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: 'User has already borrowed this book'
      });
    }

    book.availableQuantity -= 1;
    await book.save();

    const borrow = await Borrow.create({
      bookId,
      userId,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    console.log('Borrow created:', borrow);

    await StockLog.create({
      bookId,
      action: 'borrow',
      quantityChanged: 1,
      userId: req.user.id,
      notes: `Book borrowed by user ${userId}`
    });

    const populatedBorrow = await Borrow.findById(borrow._id)
      .populate('bookId', 'title author ISBN')
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      data: populatedBorrow
    });
  } catch (error) {
    console.error('Error creating borrow:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    
    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    if (borrow.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book has already been returned'
      });
    }

    borrow.returnDate = new Date();
    borrow.status = 'returned';
    await borrow.save();

    const book = await Book.findById(borrow.bookId);
    book.availableQuantity += 1;
    await book.save();

    await StockLog.create({
      bookId: borrow.bookId,
      action: 'return',
      quantityChanged: 1,
      userId: req.user.id,
      notes: `Book returned by user ${borrow.userId}`
    });

    const populatedBorrow = await Borrow.findById(borrow._id)
      .populate('bookId', 'title author ISBN')
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      data: populatedBorrow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBorrows = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.query.userId) {
      query.userId = req.query.userId;
    }
    
    if (req.query.bookId) {
      query.bookId = req.query.bookId;
    }
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    const borrows = await Borrow.find(query)
      .populate('bookId', 'title author ISBN')
      .populate('userId', 'name email')
      .sort({ borrowDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Borrow.countDocuments(query);

    res.status(200).json({
      success: true,
      data: borrows,
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

const getOverdueBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const overdueBooks = await Borrow.find({
      status: { $in: ['borrowed', 'overdue'] },
      dueDate: { $lt: new Date() }
    })
    .populate('bookId', 'title author ISBN')
    .populate('userId', 'name email')
    .sort({ dueDate: 1 })
    .skip(skip)
    .limit(limit);

    const total = await Borrow.countDocuments({
      status: { $in: ['borrowed', 'overdue'] },
      dueDate: { $lt: new Date() }
    });

    res.status(200).json({
      success: true,
      data: overdueBooks,
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

const updateOverdueStatus = async (req, res) => {
  try {
    const overdueBorrows = await Borrow.find({
      status: 'borrowed',
      dueDate: { $lt: new Date() }
    });

    const updatedBorrows = await Promise.all(
      overdueBorrows.map(async (borrow) => {
        borrow.status = 'overdue';
        return await borrow.save();
      })
    );

    res.status(200).json({
      success: true,
      message: `Updated ${updatedBorrows.length} overdue records`,
      data: updatedBorrows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBorrow,
  returnBook,
  getBorrows,
  getOverdueBooks,
  updateOverdueStatus
};
