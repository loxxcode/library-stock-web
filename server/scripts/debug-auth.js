require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken, verifyToken } = require('../utils/jwt');

const debugAuth = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected');
    
    // Check all users
    const users = await User.find({});
    console.log(`\n👥 Users in database: ${users.length}`);
    
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@library.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('\n✅ Admin user found:', adminUser.email);
    console.log('Admin user ID:', adminUser._id);
    
    // Generate token
    const token = generateToken(adminUser._id);
    console.log('\n🎫 Generated token:', token.substring(0, 50) + '...');
    
    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
      console.log('✅ Token verified successfully');
      console.log('Decoded user ID:', decoded.id);
      console.log('Matches admin ID:', decoded.id.toString() === adminUser._id.toString());
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      return;
    }
    
    // Test finding user by decoded ID
    try {
      const foundUser = await User.findById(decoded.id);
      if (foundUser) {
        console.log('✅ User found by token ID:', foundUser.email);
      } else {
        console.log('❌ User NOT found by token ID');
      }
    } catch (error) {
      console.log('❌ Error finding user by ID:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Debug script failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

debugAuth();
