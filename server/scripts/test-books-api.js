require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const { getBooks } = require('../controllers/bookController');

const testBooksAPI = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected');
    
    // Simulate API request
    const mockReq = {
      query: {
        page: 1,
        limit: 10
      }
    };
    
    let responseData = null;
    let statusCode = null;
    
    const mockRes = {
      status: function(code) {
        statusCode = code;
        return this;
      },
      json: function(data) {
        responseData = data;
        console.log(`📤 API Response (${statusCode}):`, JSON.stringify(data, null, 2));
        return this;
      }
    };
    
    console.log('\n🧪 Testing /api/books endpoint...');
    await getBooks(mockReq, mockRes);
    
    if (responseData && responseData.success) {
      console.log(`✅ API call successful - Found ${responseData.data.length} books`);
      
      // Test the data structure
      if (responseData.data.length > 0) {
        const firstBook = responseData.data[0];
        console.log('\n📖 First book structure:');
        console.log('Title:', firstBook.title);
        console.log('Author:', firstBook.author);
        console.log('ISBN:', firstBook.ISBN);
        console.log('Quantity:', firstBook.quantity);
        console.log('Available:', firstBook.availableQuantity);
        console.log('Category:', firstBook.category);
        console.log('Has _id:', !!firstBook._id);
        console.log('Has coverImage:', !!firstBook.coverImage);
      }
    } else {
      console.log('❌ API call failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

testBooksAPI();
