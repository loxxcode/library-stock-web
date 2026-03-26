require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');

const checkBooks = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected');
    
    // Check all books
    const books = await Book.find({});
    console.log(`📚 Total books in database: ${books.length}`);
    
    if (books.length > 0) {
      console.log('\n📖 Books found:');
      books.forEach((book, index) => {
        console.log(`${index + 1}. ${book.title} by ${book.author}`);
        console.log(`   ID: ${book._id}`);
        console.log(`   ISBN: ${book.ISBN}`);
        console.log(`   Quantity: ${book.availableQuantity}/${book.quantity}`);
        console.log(`   Category: ${book.category}`);
        console.log('');
      });
    } else {
      console.log('❌ No books found in database');
      
      // Create a test book
      console.log('\n➕ Creating a test book...');
      const testBook = await Book.create({
        title: 'Test Book for Debug',
        author: 'Debug Author',
        category: 'Technology',
        ISBN: '9783333333333',
        quantity: 3,
        availableQuantity: 3,
        coverImage: { url: '', public_id: '' }
      });
      
      console.log('✅ Test book created:', testBook.title);
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

checkBooks();
