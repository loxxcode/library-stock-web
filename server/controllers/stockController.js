const StockLog = require('../models/StockLog');
const Book = require('../models/Book');
const StockItem = require('../models/StockItem');

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

// New stock management functions
const getAllStockItems = async (req, res) => {
  try {
    console.log('🔍 getAllStockItems - Query params:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    if (req.query.stockLevel) {
      if (req.query.stockLevel === 'low') {
        query.$where = { $expr: { $lte: ['$quantity', '$minStock'] } };
      } else if (req.query.stockLevel === 'ok') {
        query.$where = { $expr: { $gt: ['$quantity', '$minStock'] } };
      }
    }

    console.log('🔍 getAllStockItems - Query:', query);

    const stockItems = await StockItem.find(query)
      .sort({ lastUpdated: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StockItem.countDocuments(query);

    console.log('📊 Found stock items in stockitems collection:', stockItems.length);
    console.log('📊 Sample stock item:', stockItems[0]);

    res.status(200).json({
      success: true,
      data: stockItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ getAllStockItems error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createStockItem = async (req, res) => {
  try {
    console.log('🔍 createStockItem - Request body:', req.body);
    console.log('🔍 createStockItem - Content-Type:', req.get('Content-Type'));
    
    // Handle both JSON and FormData
    let name, type, category, quantity, minStock;
    
    if (req.is('multipart/form-data')) {
      // FormData from frontend
      console.log('📝 Processing FormData...');
      name = req.body.name;
      type = req.body.type;
      category = req.body.category;
      quantity = req.body.quantity;
      minStock = req.body.minStock;
      
      console.log('📝 FormData fields:', { name, type, category, quantity, minStock });
    } else {
      // JSON data
      console.log('📝 Processing JSON...');
      ({ name, type, category, quantity, minStock } = req.body);
      console.log('📝 JSON fields:', { name, type, category, quantity, minStock });
    }
    
    if (!name || !type || !category || !quantity) {
      console.log('❌ Missing fields:', { name, type, category, quantity, minStock });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, type, category, quantity'
      });
    }

    // Create stock item using StockItem model
    const newItem = new StockItem({
      name,
      type,
      category,
      quantity: parseInt(quantity),
      minStock: parseInt(minStock) || 5,
      lastUpdated: new Date()
    });

    console.log('🔍 About to save StockItem:', newItem);

    await newItem.save();

    console.log('✅ StockItem saved to database. Collection: stockitems');
    console.log('✅ Saved item _id:', newItem._id);

    // Log the stock addition
    const stockLog = new StockLog({
      bookId: newItem._id,
      userId: req.user.id,
      action: 'added', // Use 'added' which is now in enum
      quantity: parseInt(quantity), // Use 'quantity' not 'quantityChanged'
      date: new Date()
    });
    
    console.log('🔍 About to save StockLog:', stockLog);
    await stockLog.save();
    console.log('✅ StockLog saved to database. Collection: stocklogs');

    const transformedItem = {
      _id: newItem._id,
      name: newItem.name,
      type: newItem.type,
      category: newItem.category,
      quantity: newItem.quantity,
      minStock: newItem.minStock,
      lastUpdated: newItem.lastUpdated ? newItem.lastUpdated.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    };

    console.log('✅ Stock item created:', transformedItem);

    res.status(201).json({
      success: true,
      data: transformedItem,
      message: 'Stock item created successfully'
    });
  } catch (error) {
    console.error('❌ createStockItem error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateStockItem = async (req, res) => {
  try {
    console.log('🔍 updateStockItem - Request params:', req.params);
    console.log('🔍 updateStockItem - Request body:', req.body);
    
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required'
      });
    }

    const item = await StockItem.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Stock item not found'
      });
    }

    const oldQuantity = item.quantity;
    item.quantity = parseInt(quantity);
    item.lastUpdated = new Date();
    await item.save();

    // Log the stock update
    const stockLog = new StockLog({
      bookId: item._id,
      userId: req.user.id,
      action: 'updated', // Use 'updated' which is now in enum
      quantity: parseInt(quantity) - oldQuantity, // Use 'quantity' not 'quantityChanged'
      date: new Date()
    });
    await stockLog.save();

    const transformedItem = {
      _id: item._id,
      name: item.name,
      type: item.type,
      category: item.category,
      quantity: item.quantity,
      minStock: item.minStock,
      lastUpdated: item.lastUpdated ? item.lastUpdated.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    };

    console.log('✅ Stock item updated:', transformedItem);

    res.status(200).json({
      success: true,
      data: transformedItem,
      message: 'Stock item updated successfully'
    });
  } catch (error) {
    console.error('❌ updateStockItem error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getStockLogs,
  getStockSummary,
  getAllStockItems,
  createStockItem,
  updateStockItem
};
