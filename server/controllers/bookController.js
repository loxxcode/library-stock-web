const Book = require("../models/Book");
const StockLog = require("../models/StockLog");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryHelper");

// @desc Get all books
const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.author) {
      query.author = new RegExp(req.query.author, "i");
    }

    const books = await Book.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single book
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create book
const createBook = async (req, res) => {
  try {
    const { title, author, category, ISBN, quantity } = req.body;

    if (!title || !author || !category || !ISBN || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    let coverImage = { url: "", public_id: "" };

    // ✅ FIX: use buffer not file directly
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      coverImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const book = await Book.create({
      title,
      author,
      category,
      ISBN,
      quantity,
      availableQuantity: quantity,
      coverImage,
    });

    await StockLog.create({
      bookId: book._id,
      action: "add",
      quantityChanged: quantity,
      userId: req.user?.id,
      notes: "Initial stock addition",
    });

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update book
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    const { title, author, category, ISBN, quantity } = req.body;

    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (ISBN) book.ISBN = ISBN;

    // ✅ FIX: safe quantity update
    if (quantity !== undefined && quantity !== book.quantity) {
      const diff = quantity - book.quantity;

      book.quantity = quantity;
      book.availableQuantity = Math.max(
        0,
        book.availableQuantity + diff
      );

      await StockLog.create({
        bookId: book._id,
        action: diff > 0 ? "add" : "remove",
        quantityChanged: Math.abs(diff),
        userId: req.user?.id,
        notes: "Stock updated",
      });
    }

    // ✅ FIX: delete old image then upload new one
    if (req.file) {
      if (book.coverImage?.public_id) {
        await deleteFromCloudinary(book.coverImage.public_id);
      }

      const result = await uploadToCloudinary(req.file.buffer);

      book.coverImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    await book.save();

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // ✅ delete image
    if (book.coverImage?.public_id) {
      await deleteFromCloudinary(book.coverImage.public_id);
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add stock
const addStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Provide valid quantity",
      });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    book.quantity += quantity;
    book.availableQuantity += quantity;

    await book.save();

    await StockLog.create({
      bookId: book._id,
      action: "add",
      quantityChanged: quantity,
      userId: req.user?.id,
      notes: "Stock added",
    });

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Remove stock
const removeStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Provide valid quantity",
      });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (book.availableQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    book.quantity -= quantity;
    book.availableQuantity -= quantity;

    await book.save();

    await StockLog.create({
      bookId: book._id,
      action: "remove",
      quantityChanged: quantity,
      userId: req.user?.id,
      notes: "Stock removed",
    });

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  addStock,
  removeStock,
};