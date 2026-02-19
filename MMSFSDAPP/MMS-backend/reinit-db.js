/**
 * Complete Database Reinitialization Script
 * This script clears all collections and creates fresh users with properly hashed passwords
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Asset = require('./models/Asset');
const Transfer = require('./models/Transfer');
const Purchase = require('./models/Purchase');
const Assignment = require('./models/Assignment');
const Expenditure = require('./models/Expenditure');
const ActivityLog = require('./models/ActivityLog');

// Users with plaintext passwords to be hashed
const users = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    fullName: 'System Administrator',
    role: 'Admin',
    active: true
  },
  {
    username: 'commander1',
    password: 'password123',
    email: 'commander1@example.com',
    fullName: 'Base Commander Alpha',
    role: 'BaseCommander',
    assignedBase: 'Base Alpha',
    active: true
  },
  {
    username: 'commander2',
    password: 'password123',
    email: 'commander2@example.com',
    fullName: 'Base Commander Bravo',
    role: 'BaseCommander',
    assignedBase: 'Base Bravo',
    active: true
  },
  {
    username: 'logistics1',
    password: 'password123',
    email: 'logistics1@example.com',
    fullName: 'Logistics Officer 1',
    role: 'LogisticsOfficer',
    assignedBase: 'Base Alpha',
    active: true
  },
  {
    username: 'logistics2',
    password: 'password123',
    email: 'logistics2@example.com',
    fullName: 'Logistics Officer 2',
    role: 'LogisticsOfficer',
    assignedBase: 'Base Bravo',
    active: true
  }
];

async function reinitializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Drop all collections
    console.log('\n🔄 Clearing all collections...');
    await User.deleteMany({});
    await Asset.deleteMany({});
    await Transfer.deleteMany({});
    await Purchase.deleteMany({});
    await Assignment.deleteMany({});
    await Expenditure.deleteMany({});
    await ActivityLog.deleteMany({});
    console.log('✅ All collections cleared');

    // Create users with hashed passwords
    console.log('\n👤 Creating users with properly hashed passwords...');
    const createdUsers = [];
    
    for (const userData of users) {
      // Hash the password before creating the user
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user with hashed password directly
      const user = await User.create({
        username: userData.username,
        password: hashedPassword,  // Store already-hashed password
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        assignedBase: userData.assignedBase,
        active: userData.active
      });
      
      createdUsers.push(user);
      console.log(`  ✅ Created user: ${userData.username} (${userData.role})`);
      console.log(`     Password will work with: ${userData.password}`);
    }

    console.log('\n✅ Database reinitialized successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin User:');
    console.log('   - Username: admin');
    console.log('   - Password: admin123');
    console.log('\n   Other users:');
    console.log('   - Username: commander1, commander2, logistics1, logistics2');
    console.log('   - Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error reinitializing database:', error.message);
    process.exit(1);
  }
}

// Run the script
reinitializeDatabase();
