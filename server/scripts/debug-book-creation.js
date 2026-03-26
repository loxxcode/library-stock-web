require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');

const debugBookCreation = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected');
    console.log(`Database: ${mongoose.connection.name}`);
    
    // Check existing books
    const existingBooks = await Book.find({});
    console.log(`\n📚 Current books in database: ${existingBooks.length}`);
    
    // Test book creation
    console.log('\n➕ Creating test book...');
    const testBook = {
      title: 'Debug Test Book',
      author: 'Debug Author',
      category: 'Technology',
      ISBN: '9781111111111',
      quantity: 10,
      availableQuantity: 10,
      coverImage: { url: '', public_id: '' }
    };
    
    console.log('Book data:', testBook);
    
    try {
      const createdBook = await Book.create(testBook);
      console.log('✅ Book created successfully!');
      console.log('Book ID:', createdBook._id);
      console.log('Book title:', createdBook.title);
      console.log('Created at:', createdBook.createdAt);
      
      // Verify it was saved
      const savedBook = await Book.findById(createdBook._id);
      if (savedBook) {
        console.log('✅ Book verified in database');
      } else {
        console.log('❌ Book not found in database after creation');
      }
      
      // Clean up
      await Book.findByIdAndDelete(createdBook._id);
      console.log('🗑️ Test book cleaned up');
      
    } catch (error) {
      console.error('❌ Book creation failed:');
      console.error('Error:', error.message);
      console.error('Error name:', error.name);
      console.error('Error stack:', error.stack);
    }
    
  } catch (error) {
    console.error('❌ Debug script failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

debugBookCreation();
