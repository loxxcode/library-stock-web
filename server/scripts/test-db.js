require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const User = require('../models/User');
const Borrow = require('../models/Borrow');
const StockLog = require('../models/StockLog');

const testDatabaseConnection = async () => {
  try {
    // Test database connection
    const mongoUri = process.env.MONGO_URI;
    console.log(`Testing connection to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected successfully');
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Database: ${mongoose.connection.name}`);
    
    // Test model operations
    console.log('\n📚 Testing Book model...');
    const bookCount = await Book.countDocuments();
    console.log(`Books in database: ${bookCount}`);
    
    console.log('\n👥 Testing User model...');
    const userCount = await User.countDocuments();
    console.log(`Users in database: ${userCount}`);
    
    console.log('\n📖 Testing Borrow model...');
    const borrowCount = await Borrow.countDocuments();
    console.log(`Borrow records in database: ${borrowCount}`);
    
    console.log('\n📊 Testing StockLog model...');
    const logCount = await StockLog.countDocuments();
    console.log(`Stock logs in database: ${logCount}`);
    
    // Test creating a sample book
    console.log('\n➕ Testing book creation...');
    const testBook = {
      title: 'Test Book',
      author: 'Test Author',
      category: 'Technology',
      ISBN: '9780123456789', // Valid ISBN without hyphens
      quantity: 5,
      availableQuantity: 5
    };
    
    const createdBook = await Book.create(testBook);
    console.log('✅ Test book created:', createdBook.title);
    
    // Clean up test book
    await Book.findByIdAndDelete(createdBook._id);
    console.log('🗑️ Test book cleaned up');
    
    console.log('\n✅ All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

testDatabaseConnection();
