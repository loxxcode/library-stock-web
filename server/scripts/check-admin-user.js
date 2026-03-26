require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const checkAdminUser = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected');
    
    // Check admin user
    const adminUser = await User.findOne({ email: 'admin@library.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('Email:', adminUser.email);
    console.log('Name:', adminUser.name);
    console.log('Role:', adminUser.role);
    console.log('Password hash exists:', !!adminUser.password);
    console.log('Password hash length:', adminUser.password?.length || 0);
    console.log('Password hash (first 50 chars):', adminUser.password?.substring(0, 50) + '...');
    
    // Test password comparison
    const bcrypt = require('bcryptjs');
    try {
      const isValid = await bcrypt.compare('admin123', adminUser.password);
      console.log('✅ Password comparison result:', isValid);
    } catch (error) {
      console.log('❌ Password comparison error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

checkAdminUser();
