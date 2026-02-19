#!/usr/bin/env node

/**
 * Database Initialization Script
 * This script sets up the database with admin credentials and sample data.
 * Run this ONCE after the first time you clone the project:
 * 
 * node scripts/init-db.js
 * 
 * This will:
 * 1. Connect to MongoDB
 * 2. Clear existing collections (optional - use --clear flag)
 * 3. Create admin user with proper password hashing
 * 4. Create sample users
 * 5. Create sample data
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Asset = require('../models/Asset');
const Transfer = require('../models/Transfer');
const Purchase = require('../models/Purchase');
const Assignment = require('../models/Assignment');
const Expenditure = require('../models/Expenditure');
const ActivityLog = require('../models/ActivityLog');

// Parse command line arguments
const args = process.argv.slice(2);
const shouldClear = args.includes('--clear');

// Sample users
const USERS = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@military.com',
    fullName: 'System Administrator',
    role: 'Admin',
    active: true,
  },
  {
    username: 'commander1',
    password: 'password123',
    email: 'commander1@military.com',
    fullName: 'Commander Silva',
    role: 'BaseCommander',
    assignedBase: 'Base One',
    active: true,
  },
  {
    username: 'commander2',
    password: 'password123',
    email: 'commander2@military.com',
    fullName: 'Commander Kumar',
    role: 'BaseCommander',
    assignedBase: 'Base Two',
    active: true,
  },
  {
    username: 'logistics1',
    password: 'password123',
    email: 'logistics1@military.com',
    fullName: 'Logistics Officer Singh',
    role: 'LogisticsOfficer',
    assignedBase: 'Base One',
    active: true,
  },
  {
    username: 'logistics2',
    password: 'password123',
    email: 'logistics2@military.com',
    fullName: 'Logistics Officer Patel',
    role: 'LogisticsOfficer',
    assignedBase: 'Base Two',
    active: true,
  },
];

// Sample assets
const ASSETS = [
  {
    name: 'M4 Rifle',
    type: 'Weapon',
    base: 'Base One',
    openingBalance: 100,
    closingBalance: 100,
    purchases: 0,
    transferIn: 0,
    transferOut: 0,
    assigned: 0,
    expended: 0,
    available: 100,
  },
  {
    name: 'M9 Pistol',
    type: 'Weapon',
    base: 'Base One',
    openingBalance: 50,
    closingBalance: 50,
    purchases: 0,
    transferIn: 0,
    transferOut: 0,
    assigned: 0,
    expended: 0,
    available: 50,
  },
  {
    name: 'Humvee',
    type: 'Vehicle',
    base: 'Base One',
    openingBalance: 20,
    closingBalance: 20,
    purchases: 0,
    transferIn: 0,
    transferOut: 0,
    assigned: 0,
    expended: 0,
    available: 20,
  },
  {
    name: '5.56mm Ammunition',
    type: 'Ammunition',
    base: 'Base One',
    openingBalance: 10000,
    closingBalance: 10000,
    purchases: 0,
    transferIn: 0,
    transferOut: 0,
    assigned: 0,
    expended: 0,
    available: 10000,
  },
  {
    name: 'M4 Rifle',
    type: 'Weapon',
    base: 'Base Two',
    openingBalance: 80,
    closingBalance: 80,
    purchases: 0,
    transferIn: 0,
    transferOut: 0,
    assigned: 0,
    expended: 0,
    available: 80,
  },
  {
    name: 'M9 Pistol',
    type: 'Weapon',
    base: 'Base Two',
    openingBalance: 40,
    closingBalance: 40,
    purchases: 0,
    transferIn: 0,
    transferOut: 0,
    assigned: 0,
    expended: 0,
    available: 40,
  },
  {
    name: 'APC (Armored Personnel Carrier)',
    type: 'Vehicle',
    base: 'Base Two',
    openingBalance: 15,
    closingBalance: 15,
    purchases: 0,
    transferIn: 0,
    transferOut: 0,
    assigned: 0,
    expended: 0,
    available: 15,
  },
  {
    name: '7.62mm Ammunition',
    type: 'Ammunition',
    base: 'Base Two',
    openingBalance: 8000,
    closingBalance: 8000,
    purchases: 0,
    transferIn: 0,
    transferOut: 0,
    assigned: 0,
    expended: 0,
    available: 8000,
  },
];

const initDB = async () => {
  try {
    console.log('\n🚀 Starting Database Initialization...\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Optional: Clear collections if --clear flag is provided
    if (shouldClear) {
      console.log('🗑️  Clearing all collections (--clear flag used)...');
      await User.deleteMany({});
      await Asset.deleteMany({});
      await Transfer.deleteMany({});
      await Purchase.deleteMany({});
      await Assignment.deleteMany({});
      await Expenditure.deleteMany({});
      await ActivityLog.deleteMany({});
      console.log('✅ All collections cleared\n');
    }

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin && !shouldClear) {
      console.log('⚠️  Admin user already exists. Use --clear flag to reset.\n');
      console.log('Testing existing admin authentication...');

      // Test login with existing admin
      try {
        const user = await User.findByCredentials('admin', 'admin123');
        console.log('✅ Admin authentication test PASSED\n');
        console.log('Database is ready! You can login with:');
        console.log('  Username: admin');
        console.log('  Password: admin123\n');
        process.exit(0);
      } catch (error) {
        console.log('❌ Admin authentication test FAILED');
        console.log(`Error: ${error.message}`);
        console.log('\nPlease run with --clear flag to reset:');
        console.log('  node scripts/init-db.js --clear\n');
        process.exit(1);
      }
    }

    // Create users with proper password hashing
    console.log('👤 Creating users with proper password hashing...');
    const createdUsers = [];

    for (const userData of USERS) {
      // Check if user already exists
      const existingUser = await User.findOne({ username: userData.username });
      if (existingUser) {
        console.log(`   ⊘ User already exists: ${userData.username}`);
        createdUsers.push(existingUser);
        continue;
      }

      // Create new user
      const user = new User({
        username: userData.username,
        password: userData.password,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        assignedBase: userData.assignedBase,
        active: userData.active,
      });

      await user.save();
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${userData.username}`);
    }
    console.log(`✅ Users created/verified\n`);

    // Verify password hashing
    console.log('🔐 Verifying password hashing...');
    for (const userData of USERS) {
      const user = await User.findOne({ username: userData.username });
      const isMatch = await bcrypt.compare(userData.password, user.password);

      if (isMatch) {
        console.log(`   ✓ ${userData.username}: Password hash verified ✅`);
      } else {
        console.log(`   ✗ ${userData.username}: Password hash verification FAILED ❌`);
        throw new Error(`Password hash verification failed for ${userData.username}`);
      }
    }
    console.log('✅ All passwords verified\n');

    // Test authentication
    console.log('🧪 Testing authentication with provided credentials...');
    for (const userData of USERS) {
      try {
        const user = await User.findByCredentials(userData.username, userData.password);
        console.log(`   ✓ ${userData.username}: Authentication test passed ✅`);
      } catch (error) {
        console.log(`   ✗ ${userData.username}: Authentication test FAILED ❌`);
        console.log(`      Error: ${error.message}`);
        throw error;
      }
    }
    console.log('✅ All authentication tests passed\n');

    // Create sample assets
    console.log('📦 Creating sample assets...');
    const createdAssets = [];
    for (const assetData of ASSETS) {
      const existingAsset = await Asset.findOne({
        name: assetData.name,
        base: assetData.base,
      });
      if (!existingAsset) {
        const asset = await Asset.create(assetData);
        createdAssets.push(asset);
        console.log(`   ✓ Created asset: ${assetData.name} at ${assetData.base}`);
      } else {
        createdAssets.push(existingAsset);
      }
    }
    console.log(`✅ Assets created/verified\n`);

    // --- Sample Purchases ---
    console.log('🛒 Creating sample purchases...');
    const existingPurchases = await Purchase.countDocuments({});
    if (existingPurchases === 0) {
      const logisticsUser1 = createdUsers.find(u => u.username === 'logistics1');
      const logisticsUser2 = createdUsers.find(u => u.username === 'logistics2');
      const adminUser = createdUsers.find(u => u.username === 'admin');

      const purchases = [
        {
          assetName: 'M4 Rifle',
          assetType: 'Weapon',
          base: 'Base One',
          quantity: 25,
          unitCost: 1200,
          supplier: 'Defense Arms Corp.',
          purchaseDate: new Date('2026-01-10'),
          status: 'Delivered',
          purchasedBy: logisticsUser1._id,
          approvedBy: adminUser._id,
          invoiceNumber: 'INV-2026-001',
          notes: 'Annual weapon procurement batch 1',
        },
        {
          assetName: '5.56mm Ammunition',
          assetType: 'Ammunition',
          base: 'Base One',
          quantity: 5000,
          unitCost: 0.35,
          supplier: 'National Ammo Supply',
          purchaseDate: new Date('2026-01-15'),
          status: 'Delivered',
          purchasedBy: logisticsUser1._id,
          approvedBy: adminUser._id,
          invoiceNumber: 'INV-2026-002',
          notes: 'Quarterly ammunition resupply',
        },
        {
          assetName: 'Humvee',
          assetType: 'Vehicle',
          base: 'Base One',
          quantity: 3,
          unitCost: 220000,
          supplier: 'AM General LLC',
          purchaseDate: new Date('2026-02-01'),
          status: 'Ordered',
          purchasedBy: logisticsUser1._id,
          invoiceNumber: 'INV-2026-003',
          notes: 'Replacement vehicles for aging fleet',
        },
        {
          assetName: 'M9 Pistol',
          assetType: 'Weapon',
          base: 'Base Two',
          quantity: 15,
          unitCost: 550,
          supplier: 'Defense Arms Corp.',
          purchaseDate: new Date('2026-01-20'),
          status: 'Delivered',
          purchasedBy: logisticsUser2._id,
          approvedBy: adminUser._id,
          invoiceNumber: 'INV-2026-004',
          notes: 'Sidearm procurement for new recruits',
        },
        {
          assetName: '7.62mm Ammunition',
          assetType: 'Ammunition',
          base: 'Base Two',
          quantity: 3000,
          unitCost: 0.50,
          supplier: 'National Ammo Supply',
          purchaseDate: new Date('2026-02-05'),
          status: 'Ordered',
          purchasedBy: logisticsUser2._id,
          invoiceNumber: 'INV-2026-005',
          notes: 'Training ammunition for marksman qualification',
        },
      ];

      for (const p of purchases) {
        await Purchase.create(p);
        console.log(`   ✓ Purchase: ${p.quantity}x ${p.assetName} (${p.status})`);
      }
    } else {
      console.log('   ⊘ Purchases already exist');
    }
    console.log('✅ Purchases created/verified\n');

    // --- Sample Transfers ---
    console.log('🔄 Creating sample transfers...');
    const existingTransfers = await Transfer.countDocuments({});
    if (existingTransfers === 0) {
      const logisticsUser1 = createdUsers.find(u => u.username === 'logistics1');
      const commander1 = createdUsers.find(u => u.username === 'commander1');
      const commander2 = createdUsers.find(u => u.username === 'commander2');
      const m4BaseOne = createdAssets.find(a => a.name === 'M4 Rifle' && a.base === 'Base One');
      const pistolBaseOne = createdAssets.find(a => a.name === 'M9 Pistol' && a.base === 'Base One');
      const ammoBaseOne = createdAssets.find(a => a.name === '5.56mm Ammunition' && a.base === 'Base One');

      const transfers = [
        {
          asset: m4BaseOne._id,
          assetName: 'M4 Rifle',
          assetType: 'Weapon',
          fromBase: 'Base One',
          toBase: 'Base Two',
          quantity: 10,
          status: 'Completed',
          transferredBy: logisticsUser1._id,
          approvedBy: commander1._id,
          notes: 'Weapon redistribution for upcoming exercise',
        },
        {
          asset: pistolBaseOne._id,
          assetName: 'M9 Pistol',
          assetType: 'Weapon',
          fromBase: 'Base One',
          toBase: 'Base Two',
          quantity: 5,
          status: 'Pending',
          transferredBy: logisticsUser1._id,
          notes: 'Requested by Base Two commander',
        },
        {
          asset: ammoBaseOne._id,
          assetName: '5.56mm Ammunition',
          assetType: 'Ammunition',
          fromBase: 'Base One',
          toBase: 'Base Two',
          quantity: 2000,
          status: 'Completed',
          transferredBy: logisticsUser1._id,
          approvedBy: commander2._id,
          notes: 'Ammo transfer for joint training ops',
        },
      ];

      for (const t of transfers) {
        await Transfer.create(t);
        console.log(`   ✓ Transfer: ${t.quantity}x ${t.assetName} ${t.fromBase} → ${t.toBase} (${t.status})`);
      }
    } else {
      console.log('   ⊘ Transfers already exist');
    }
    console.log('✅ Transfers created/verified\n');

    // --- Sample Assignments ---
    console.log('📋 Creating sample assignments...');
    const existingAssignments = await Assignment.countDocuments({});
    if (existingAssignments === 0) {
      const commander1 = createdUsers.find(u => u.username === 'commander1');
      const commander2 = createdUsers.find(u => u.username === 'commander2');
      const m4BaseOne = createdAssets.find(a => a.name === 'M4 Rifle' && a.base === 'Base One');
      const humveeBaseOne = createdAssets.find(a => a.name === 'Humvee' && a.base === 'Base One');
      const m4BaseTwo = createdAssets.find(a => a.name === 'M4 Rifle' && a.base === 'Base Two');

      const assignments = [
        {
          asset: m4BaseOne._id,
          assetName: 'M4 Rifle',
          assetType: 'Weapon',
          base: 'Base One',
          quantity: 20,
          assignedTo: { name: 'Alpha Squad', rank: 'Squad', id: 'SQ-A001' },
          assignedBy: commander1._id,
          purpose: 'Border Patrol Duty',
          startDate: new Date('2026-01-15'),
          status: 'Active',
          returnedQuantity: 0,
          notes: 'Rotation duty - 3 month assignment',
        },
        {
          asset: humveeBaseOne._id,
          assetName: 'Humvee',
          assetType: 'Vehicle',
          base: 'Base One',
          quantity: 4,
          assignedTo: { name: 'Transport Platoon', rank: 'Platoon', id: 'PLT-T01' },
          assignedBy: commander1._id,
          purpose: 'Convoy Operations',
          startDate: new Date('2026-02-01'),
          status: 'Active',
          returnedQuantity: 0,
          notes: 'Supply convoy to forward operating base',
        },
        {
          asset: m4BaseTwo._id,
          assetName: 'M4 Rifle',
          assetType: 'Weapon',
          base: 'Base Two',
          quantity: 15,
          assignedTo: { name: 'Bravo Squad', rank: 'Squad', id: 'SQ-B001' },
          assignedBy: commander2._id,
          purpose: 'Field Training Exercise',
          startDate: new Date('2026-01-20'),
          endDate: new Date('2026-02-20'),
          status: 'Active',
          returnedQuantity: 0,
          notes: 'Month-long field exercise',
        },
        {
          asset: m4BaseOne._id,
          assetName: 'M4 Rifle',
          assetType: 'Weapon',
          base: 'Base One',
          quantity: 10,
          assignedTo: { name: 'Sgt. Ravi Kumar', rank: 'Sergeant', id: 'SGT-R102' },
          assignedBy: commander1._id,
          purpose: 'Weapons Training',
          startDate: new Date('2025-12-01'),
          endDate: new Date('2026-01-10'),
          status: 'Returned',
          returnedQuantity: 10,
          notes: 'Training cycle completed',
        },
      ];

      for (const a of assignments) {
        await Assignment.create(a);
        console.log(`   ✓ Assignment: ${a.quantity}x ${a.assetName} → ${a.assignedTo.name} (${a.status})`);
      }
    } else {
      console.log('   ⊘ Assignments already exist');
    }
    console.log('✅ Assignments created/verified\n');

    // --- Sample Expenditures ---
    console.log('💥 Creating sample expenditures...');
    const existingExpenditures = await Expenditure.countDocuments({});
    if (existingExpenditures === 0) {
      const commander1 = createdUsers.find(u => u.username === 'commander1');
      const commander2 = createdUsers.find(u => u.username === 'commander2');
      const ammoBaseOne = createdAssets.find(a => a.name === '5.56mm Ammunition' && a.base === 'Base One');
      const ammoBaseTwo = createdAssets.find(a => a.name === '7.62mm Ammunition' && a.base === 'Base Two');

      const expenditures = [
        {
          asset: ammoBaseOne._id,
          assetName: '5.56mm Ammunition',
          assetType: 'Ammunition',
          base: 'Base One',
          quantity: 1500,
          reason: 'Training',
          authorizedBy: commander1._id,
          expendedBy: { name: 'Sgt. Major Daniels', rank: 'Sergeant Major', id: 'SGM-D01' },
          operationName: 'Marksmanship Qualification Q1',
          expenditureDate: new Date('2026-01-25'),
          location: 'Base One Firing Range',
          notes: 'Quarterly rifle qualification',
        },
        {
          asset: ammoBaseOne._id,
          assetName: '5.56mm Ammunition',
          assetType: 'Ammunition',
          base: 'Base One',
          quantity: 800,
          reason: 'Operation',
          authorizedBy: commander1._id,
          expendedBy: { name: 'Lt. Col. Harris', rank: 'Lieutenant Colonel', id: 'LTC-H01' },
          operationName: 'Operation Shield Wall',
          expenditureDate: new Date('2026-02-10'),
          location: 'Forward Operating Post 3',
          notes: 'Defensive operation expenditure',
        },
        {
          asset: ammoBaseTwo._id,
          assetName: '7.62mm Ammunition',
          assetType: 'Ammunition',
          base: 'Base Two',
          quantity: 1000,
          reason: 'Training',
          authorizedBy: commander2._id,
          expendedBy: { name: 'Cpl. Ahmed Khan', rank: 'Corporal', id: 'CPL-A01' },
          operationName: 'Sniper Qualification Program',
          expenditureDate: new Date('2026-02-05'),
          location: 'Base Two Long Range',
          notes: 'Annual sniper qualification',
        },
      ];

      for (const e of expenditures) {
        await Expenditure.create(e);
        console.log(`   ✓ Expenditure: ${e.quantity}x ${e.assetName} - ${e.reason}`);
      }
    } else {
      console.log('   ⊘ Expenditures already exist');
    }
    console.log('✅ Expenditures created/verified\n');

    // --- Sample Activity Logs ---
    console.log('📝 Creating sample activity logs...');
    const existingLogs = await ActivityLog.countDocuments({});
    if (existingLogs === 0) {
      const adminUser = createdUsers.find(u => u.username === 'admin');
      const commander1 = createdUsers.find(u => u.username === 'commander1');
      const logisticsUser1 = createdUsers.find(u => u.username === 'logistics1');

      const logs = [
        {
          user: adminUser._id,
          username: 'admin',
          action: 'Create',
          resourceType: 'User',
          details: { message: 'System initialized with default users' },
          timestamp: new Date('2026-01-01'),
        },
        {
          user: logisticsUser1._id,
          username: 'logistics1',
          action: 'Create',
          resourceType: 'Purchase',
          details: { message: 'Created purchase order INV-2026-001 for 25x M4 Rifles' },
          timestamp: new Date('2026-01-10'),
        },
        {
          user: commander1._id,
          username: 'commander1',
          action: 'Create',
          resourceType: 'Assignment',
          details: { message: 'Assigned 20x M4 Rifles to Alpha Squad for Border Patrol' },
          timestamp: new Date('2026-01-15'),
        },
        {
          user: logisticsUser1._id,
          username: 'logistics1',
          action: 'Create',
          resourceType: 'Transfer',
          details: { message: 'Transferred 10x M4 Rifles from Base One to Base Two' },
          timestamp: new Date('2026-01-18'),
        },
        {
          user: commander1._id,
          username: 'commander1',
          action: 'Create',
          resourceType: 'Expenditure',
          details: { message: 'Expended 1500x 5.56mm Ammo for Marksmanship Qualification' },
          timestamp: new Date('2026-01-25'),
        },
      ];

      for (const l of logs) {
        await ActivityLog.create(l);
        console.log(`   ✓ Log: [${l.action}] ${l.resourceType} by ${l.username}`);
      }
    } else {
      console.log('   ⊘ Activity logs already exist');
    }
    console.log('✅ Activity logs created/verified\n');

    // Summary
    console.log('═══════════════════════════════════════════════════\n');
    console.log('  ✅ DATABASE INITIALIZATION SUCCESSFUL!\n');
    console.log('  Login Credentials:');
    console.log('    Admin:       admin / admin123');
    console.log('    Commander1:  commander1 / password123');
    console.log('    Commander2:  commander2 / password123');
    console.log('    Logistics1:  logistics1 / password123');
    console.log('    Logistics2:  logistics2 / password123\n');
    console.log('  Sample Data Created:');
    console.log('    - 8 Assets (weapons, vehicles, ammunition)');
    console.log('    - 5 Purchases (various statuses)');
    console.log('    - 3 Transfers (completed & pending)');
    console.log('    - 4 Assignments (active & returned)');
    console.log('    - 3 Expenditures (training & operations)');
    console.log('    - 5 Activity Logs\n');
    console.log('═══════════════════════════════════════════════════\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database initialization:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run the initialization
initDB();
