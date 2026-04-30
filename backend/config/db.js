const mongoose = require('mongoose');

const connectDB = async () => {
  try {

    
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📀 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't exit, just log
  }
};

module.exports = connectDB;