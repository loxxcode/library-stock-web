require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const fixAdminUser = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected');
    
    // Delete existing admin user
    const existingAdmin = await User.findOne({ email: 'admin@library.com' });
    if (existingAdmin) {
      await User.deleteOne({ email: 'admin@library.com' });
      console.log('🗑️ Deleted existing admin user');
    }
    
    // Hash password manually
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('✅ Password hashed manually');
    console.log('Hash length:', hashedPassword.length);
    
    // Create admin user with hashed password
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@library.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Admin user created successfully:');
    console.log('Email: admin@library.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('User ID:', admin._id);
    
    // Test password comparison - need to select password explicitly
    const adminWithPassword = await User.findOne({ email: 'admin@library.com' }).select('+password');
    if (adminWithPassword) {
      console.log('✅ User found with password');
      console.log('Password hash length:', adminWithPassword.password.length);
      
      const isValid = await bcrypt.compare('admin123', adminWithPassword.password);
      console.log('✅ Password test:', isValid);
    } else {
      console.log('❌ User not found with password');
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

fixAdminUser();
