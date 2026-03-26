require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const testBookCreationAPI = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected');
    
    // Get admin user
    const adminUser = await User.findOne({ email: 'admin@library.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:', adminUser.email);
    
    // Generate token
    const token = generateToken(adminUser._id);
    console.log('🎫 Token generated');
    
    // Simulate API request data
    const bookData = {
      title: 'API Test Book',
      author: 'API Test Author',
      category: 'Technology',
      ISBN: '9782222222222',
      quantity: 5
    };
    
    console.log('📚 Book data:', bookData);
    
    // Simulate req object
    const mockReq = {
      body: bookData,
      file: null, // No file for this test
      user: adminUser
    };
    
    // Simulate res object
    let responseData = null;
    let statusCode = null;
    
    const mockRes = {
      status: function(code) {
        statusCode = code;
        return this;
      },
      json: function(data) {
        responseData = data;
        console.log(`📤 Response (${statusCode}):`, responseData);
        return this;
      }
    };
    
    // Import and test the controller
    const { createBook } = require('../controllers/bookController');
    
    console.log('\n🧪 Testing book creation controller...');
    await createBook(mockReq, mockRes);
    
    // Check if book was actually created
    if (responseData && responseData.success) {
      const bookId = responseData.data._id;
      console.log('🔍 Checking if book was saved...');
      
      const savedBook = await Book.findById(bookId);
      if (savedBook) {
        console.log('✅ Book successfully saved in database!');
        console.log('Book details:', {
          id: savedBook._id,
          title: savedBook.title,
          author: savedBook.author,
          quantity: savedBook.quantity
        });
        
        // Clean up
        await Book.findByIdAndDelete(bookId);
        console.log('🗑️ Test book cleaned up');
      } else {
        console.log('❌ Book NOT found in database!');
      }
    } else {
      console.log('❌ Book creation failed in controller');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

testBookCreationAPI();
