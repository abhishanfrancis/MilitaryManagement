#!/usr/bin/env node

/**
 * Complete Database Reset & Authentication Setup
 * Clears all data and reseeds with correct password hashing
 * Run this after any restart to ensure authentication works
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Asset = require('./models/Asset');
const Transfer = require('./models/Transfer');
const Purchase = require('./models/Purchase');
const Assignment = require('./models/Assignment');
const Expenditure = require('./models/Expenditure');
const ActivityLog = require('./models/ActivityLog');

const USERS = [
  { username: 'admin', password: 'admin123', email: 'admin@military.com', fullName: 'Administrator', role: 'Admin', assignedBase: null, active: true },
  { username: 'commander1', password: 'password123', email: 'commander1@military.com', fullName: 'Commander Silva', role: 'BaseCommander', assignedBase: 'Base One', active: true },
  { username: 'commander2', password: 'password123', email: 'commander2@military.com', fullName: 'Commander Kumar', role: 'BaseCommander', assignedBase: 'Base Two', active: true },
  { username: 'logistics1', password: 'password123', email: 'logistics1@military.com', fullName: 'Logistics Officer Singh', role: 'LogisticsOfficer', assignedBase: 'Base One', active: true },
  { username: 'logistics2', password: 'password123', email: 'logistics2@military.com', fullName: 'Logistics Officer Patel', role: 'LogisticsOfficer', assignedBase: 'Base Two', active: true }
];

const resetAndSeed = async () => {
  try {
    console.log('🔄 Starting complete database reset and authentication setup...\n');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear all collections
    console.log('🗑️  Clearing all collections...');
    await User.deleteMany({});
    await Asset.deleteMany({});
    await Transfer.deleteMany({});
    await Purchase.deleteMany({});
    await Assignment.deleteMany({});
    await Expenditure.deleteMany({});
    await ActivityLog.deleteMany({});
    console.log('✅ All collections cleared\n');

    // Create users with proper password hashing
    console.log('👤 Creating users with correct password hashing...');
    const createdUsers = [];
    
    for (const userData of USERS) {
      const user = new User({
        username: userData.username,
        password: userData.password,  // Let pre-save hook hash this
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        assignedBase: userData.assignedBase,
        active: userData.active
      });
      
      await user.save();
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${userData.username}`);
    }
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Verify passwords were hashed correctly
    console.log('🔐 Verifying password hashing...');
    for (const userData of USERS) {
      const user = await User.findOne({ username: userData.username });
      const isMatch = await bcrypt.compare(userData.password, user.password);
      
      if (isMatch) {
        console.log(`   ✓ ${userData.username}: Password hash verified ✅`);
      } else {
        console.log(`   ✗ ${userData.username}: Password hash FAILED ❌`);
        throw new Error(`Password hash verification failed for ${userData.username}`);
      }
    }
    console.log('✅ All passwords verified\n');

    // Test authentication
    console.log('🧪 Testing authentication...');
    for (const userData of USERS) {
      try {
        const user = await User.findByCredentials(userData.username, userData.password);
        console.log(`   ✓ ${userData.username}: Authentication test passed ✅`);
      } catch (error) {
        console.log(`   ✗ ${userData.username}: Authentication test FAILED ❌ - ${error.message}`);
        throw error;
      }
    }
    console.log('✅ All authentication tests passed\n');

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ DATABASE RESET & AUTHENTICATION SETUP COMPLETE');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('📋 Created Users (Ready for Login):');
    USERS.forEach(u => {
      console.log(`   • ${u.username} / ${u.password} (${u.role})`);
    });
    
    console.log('\n🎯 You can now login with any of these credentials!');
    console.log('\n');
    
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERROR DURING RESET:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

resetAndSeed();
