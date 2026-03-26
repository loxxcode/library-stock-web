const mongoose = require('mongoose');

const getDatabaseUri = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  console.log(`Environment: ${nodeEnv}`);
  
  if (nodeEnv === 'production') {
    const atlasUri = process.env.MONGO_URI_ATLAS;
    if (atlasUri) {
      console.log('Using MongoDB Atlas for production');
      return atlasUri;
    }
  }
  
  // Development or fallback to local
  const localUri = process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/library_stock_management';
  console.log('Using Local MongoDB for development');
  return localUri;
};

const connectDB = async () => {
  try {
    const mongoUri = getDatabaseUri();
    console.log(`Connecting to MongoDB: ${mongoUri}`);
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
