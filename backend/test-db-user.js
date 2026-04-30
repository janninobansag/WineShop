const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Get the user
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({ email: 'asdas@asdasd' });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User email:', user.email);
    console.log('Stored hash:', user.password);
    
    // Test the password
    const password = "123123123";
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

test();