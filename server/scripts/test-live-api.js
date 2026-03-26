require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');

const testLiveAPI = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected');
    
    // Test 1: Direct database query
    console.log('\n🔍 Test 1: Direct database query');
    const allBooks = await Book.find({});
    console.log(`Found ${allBooks.length} books directly from database`);
    
    // Test 2: Query with empty filters (like the API)
    console.log('\n🔍 Test 2: Query with empty filters');
    const query = {};
    const filteredBooks = await Book.find(query)
      .skip(0)
      .limit(10)
      .sort({ createdAt: -1 });
    
    console.log(`Found ${filteredBooks.length} books with empty query`);
    filteredBooks.forEach((book, index) => {
      console.log(`  ${index + 1}. ${book.title} (${book._id})`);
    });
    
    // Test 3: Check if there are any text search indexes
    console.log('\n🔍 Test 3: Check for text search indexes');
    const indexes = await Book.collection.getIndexes();
    console.log('Indexes on Book collection:', Object.keys(indexes));
    
    // Test 4: Try a simple find without any filters
    console.log('\n🔍 Test 4: Simple find without filters');
    const simpleBooks = await Book.find({});
    console.log(`Simple find returned ${simpleBooks.length} books`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

testLiveAPI();
