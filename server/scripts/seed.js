require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@library.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@library.com',
      password: 'admin123', // Model will hash this automatically
      role: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@library.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    // Verify the user was created correctly
    const adminWithPassword = await User.findOne({ email: 'admin@library.com' }).select('+password');
    const isValid = await adminWithPassword.comparePassword('admin123');
    
    if (isValid) {
      console.log('✅ Admin user password verified and ready for login');
    } else {
      console.log('❌ Admin user password verification failed');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
