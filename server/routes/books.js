const express = require("express");

const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  addStock,
  removeStock,
} = require("../controllers/bookController");

const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

/**
 * 🔐 Protect all routes
 */
router.use(authenticate);

/**
 * 📚 Book Routes
 */

// Get all books (with pagination, search, filters)
router.get("/", getBooks);

// Get single book
router.get("/:id", getBook);

// Create book (Admin only + image upload)
router.post(
  "/",
  authorize("admin"),
  upload.single("cover"), // ✅ IMPORTANT: must match controller
  createBook
);

// Update book (Admin only + optional image upload)
router.put(
  "/:id",
  authorize("admin"),
  upload.single("cover"), // ✅ same field name
  updateBook
);

// Delete book (Admin only)
router.delete("/:id", authorize("admin"), deleteBook);

/**
 * 📦 Stock Management
 */

// Add stock
router.patch("/:id/add-stock", authorize("admin"), addStock);

// Remove stock
router.patch("/:id/remove-stock", authorize("admin"), removeStock);

module.exports = router;