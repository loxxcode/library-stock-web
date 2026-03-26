require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const debugPassword = async () => {
  try {
    console.log('🔍 Debugging password hashing...');
    
    // Test 1: Hash password directly
    const password = 'admin123';
    const hash1 = await bcrypt.hash(password, 12);
    console.log('✅ Direct hash:', hash1);
    
    // Test 2: Compare with direct hash
    const isValid1 = await bcrypt.compare(password, hash1);
    console.log('✅ Direct comparison:', isValid1);
    
    // Test 3: Connect to database
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Test 4: Create user with direct hash
    const User = require('../models/User');
    await User.deleteMany({ email: 'admin@library.com' });
    
    const testUser = await User.create({
      name: 'Test Admin',
      email: 'admin@library.com',
      password: hash1,
      role: 'admin'
    });
    
    console.log('✅ User created with direct hash');
    
    // Test 5: Retrieve user with password
    const userWithPassword = await User.findOne({ email: 'admin@library.com' }).select('+password');
    console.log('✅ User retrieved with password');
    console.log('Stored hash length:', userWithPassword.password.length);
    console.log('Stored hash:', userWithPassword.password);
    
    // Test 6: Compare stored hash
    const isValid2 = await bcrypt.compare(password, userWithPassword.password);
    console.log('✅ Stored comparison:', isValid2);
    
    // Test 7: Use the model method
    const isValid3 = await userWithPassword.comparePassword(password);
    console.log('✅ Model method comparison:', isValid3);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

debugPassword();
