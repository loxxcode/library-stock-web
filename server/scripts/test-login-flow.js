require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken, verifyToken } = require('../utils/jwt');

const testLoginFlow = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected');
    
    // Test 1: Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@library.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found - running seed...');
      return;
    }
    
    console.log('✅ Admin user found:', adminUser.email);
    
    // Test 2: Simulate login
    const adminWithPassword = await User.findOne({ email: 'admin@library.com' }).select('+password');
    const isPasswordValid = await adminWithPassword.comparePassword('admin123');
    console.log('✅ Password validation:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password validation failed');
      return;
    }
    
    // Test 3: Generate token
    const token = generateToken(adminUser._id);
    console.log('✅ Token generated');
    
    // Test 4: Verify token
    const decoded = verifyToken(token);
    console.log('✅ Token verified, user ID:', decoded.id);
    
    // Test 5: Find user by token ID
    const userFromToken = await User.findById(decoded.id);
    if (userFromToken) {
      console.log('✅ User found from token:', userFromToken.email);
    } else {
      console.log('❌ User not found from token');
      return;
    }
    
    console.log('\n🎉 Login flow test passed!');
    console.log('Token for manual testing:');
    console.log(token);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

testLoginFlow();
