const mongoose = require('mongoose');
require('dotenv').config();

async function checkDB() {
  await mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
  
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\n=== DATABASE COLLECTIONS ===');
    console.log('Collections:', collections.map(c => c.name).join(', '));
    
    console.log('\n=== DOCUMENT COUNT ===');
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`${collection.name}: ${count} documents`);
    }
    
    console.log('\n=== SAMPLE DATA ===');
    const usersCount = await db.collection('users').countDocuments();
    console.log(`Users: ${usersCount}`);
    const assetsCount = await db.collection('assets').countDocuments();
    console.log(`Assets: ${assetsCount}`);
    const unitsCount = await db.collection('units').countDocuments();
    console.log(`Units: ${unitsCount}`);
    
  } finally {
    process.exit(0);
  }
}

checkDB();
