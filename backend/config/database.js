const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📍 Database Host: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log('🚀 Database is ready for operations!\n');
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('🔍 Error Details:', error.message);
    console.error('💡 Please check:');
    console.error('   - MongoDB Atlas IP whitelist');
    console.error('   - Database user credentials');
    console.error('   - Network connectivity');
    console.error('   - MongoDB Atlas cluster status\n');
    process.exit(1);
  }
};

module.exports = connectDB;