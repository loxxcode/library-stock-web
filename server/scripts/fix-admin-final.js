require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const fixAdminFinal = async () => {
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
    await User.deleteMany({ email: 'admin@library.com' });
    console.log('🗑️ Deleted existing admin user');
    
    // Create admin user with plain password (model will hash it)
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@library.com',
      password: 'admin123', // Plain password - model will hash it
      role: 'admin'
    });
    
    console.log('✅ Admin user created successfully:');
    console.log('Email: admin@library.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('User ID:', admin._id);
    
    // Test login - retrieve user with password
    const adminWithPassword = await User.findOne({ email: 'admin@library.com' }).select('+password');
    if (adminWithPassword) {
      console.log('✅ User found with password');
      console.log('Password hash exists:', !!adminWithPassword.password);
      console.log('Password hash length:', adminWithPassword.password.length);
      
      // Test password comparison using model method
      const isValid = await adminWithPassword.comparePassword('admin123');
      console.log('✅ Password comparison test:', isValid);
      
      if (isValid) {
        console.log('\n🎉 Admin user is ready for login!');
      } else {
        console.log('\n❌ Password comparison still failed');
      }
    } else {
      console.log('❌ User not found with password');
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database disconnected');
  }
};

fixAdminFinal();
