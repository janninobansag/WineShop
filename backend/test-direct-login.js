const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testLogin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');
    
    // Get the user collection
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users`);
    
    // Show all users
    users.forEach(user => {
      console.log(`- ${user.email} (role: ${user.role})`);
    });
    
    // Test specific user
    const testEmail = 'asdas@asdasd'; // Change to your test email
    const testPassword = '123123123'; // Change to your test password
    
    const user = await db.collection('users').findOne({ email: testEmail });
    
    if (user) {
      console.log(`\nTesting user: ${user.email}`);
      console.log(`Stored hash: ${user.password}`);
      
      const isValid = bcrypt.compareSync(testPassword, user.password);
      console.log(`Password "${testPassword}" match: ${isValid}`);
      
      if (!isValid) {
        // Create a new hash for comparison
        const newHash = bcrypt.hashSync(testPassword, 10);
        console.log(`New hash for same password: ${newHash}`);
      }
    } else {
      console.log(`\nUser ${testEmail} not found`);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();