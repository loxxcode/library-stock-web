const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library-stock-management')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Get all collections
    mongoose.connection.db.listCollections().toArray((err, collections) => {
      if (err) {
        console.error('❌ Error getting collections:', err);
        return;
      }
      
      console.log('\n📚 Available collections:');
      collections.forEach(collection => {
        console.log(`  - ${collection.name}`);
      });
      
      // Check specific collections
      checkCollection('stockitems');
      checkCollection('stocklogs');
      checkCollection('books');
      checkCollection('users');
      checkCollection('borrows');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

function checkCollection(collectionName) {
  mongoose.connection.db.collection(collectionName).countDocuments((err, count) => {
    if (err) {
      console.error(`❌ Error checking ${collectionName}:`, err);
      return;
    }
    console.log(`\n📊 ${collectionName}: ${count} documents`);
    
    if (count > 0 && count < 10) {
      // Show first few documents if collection is small
      mongoose.connection.db.collection(collectionName).find({}).limit(3).toArray((err, docs) => {
        if (err) {
          console.error(`❌ Error fetching ${collectionName}:`, err);
          return;
        }
        console.log(`Sample documents in ${collectionName}:`);
        docs.forEach((doc, index) => {
          console.log(`  ${index + 1}.`, JSON.stringify(doc, null, 2));
        });
      });
    }
  });
}

// Close connection after 5 seconds
setTimeout(() => {
  mongoose.connection.close();
  console.log('\n🔌 Connection closed');
}, 5000);
