const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
  
  const passwords = {
    'admin': 'admin123',
    'commander1': 'password123',
    'commander2': 'password123',
    'logistics1': 'password123',
    'logistics2': 'password123'
  };
  
  for (const [username, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    await mongoose.connection.collection('users').updateOne(
      {username},
      {$set: {password: hash}}
    );
    console.log(`Updated ${username} with new hash: ${hash}`);
  }
  
  process.exit(0);
}

test();
