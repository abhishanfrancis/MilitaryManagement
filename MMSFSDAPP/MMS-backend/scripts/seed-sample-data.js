/**
 * MRMS Comprehensive Sample Data Seed Script
 * 
 * Seeds 5-6 entries each for: Bases, Units, Soldiers, Equipment, Missions
 * All data is cross-referenced so dashboard graphs and tables work correctly.
 */

require('dotenv').config();
const mongoose = require('mongoose');

const Rank = require('../models/Rank');
const Base = require('../models/Base');
const Unit = require('../models/Unit');
const Soldier = require('../models/Soldier');
const Equipment = require('../models/Equipment');
const Mission = require('../models/Mission');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/military-asset-management';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });

async function seed() {
  try {
    // ── 1. Ensure Ranks exist ───────────────────────────────────────────
    let ranks = await Rank.find().sort('level');
    if (ranks.length === 0) {
      console.log('No ranks found – seeding ranks first...');
      const rankData = [
        { name: 'Private', abbreviation: 'PVT', level: 1, category: 'Enlisted', payGrade: 'E-1' },
        { name: 'Corporal', abbreviation: 'CPL', level: 5, category: 'NCO', payGrade: 'E-4' },
        { name: 'Sergeant', abbreviation: 'SGT', level: 6, category: 'NCO', payGrade: 'E-5' },
        { name: 'Captain', abbreviation: 'CPT', level: 15, category: 'Officer', payGrade: 'O-3' },
        { name: 'Major', abbreviation: 'MAJ', level: 16, category: 'Officer', payGrade: 'O-4' },
        { name: 'Colonel', abbreviation: 'COL', level: 18, category: 'Officer', payGrade: 'O-6' },
        { name: 'Brigadier General', abbreviation: 'BG', level: 19, category: 'General', payGrade: 'O-7' },
      ];
      ranks = await Rank.insertMany(rankData);
    }
    console.log(`✓ Ranks ready (${ranks.length})`);

    // Helper to pick a rank by abbreviation
    const rankId = (abbr) => {
      const r = ranks.find(r => r.abbreviation === abbr);
      return r ? r._id : ranks[0]._id;
    };

    // ── 2. Bases (6) ────────────────────────────────────────────────────
    await Base.deleteMany({});
    const bases = await Base.insertMany([
      {
        name: 'Fort Sentinel',
        location: 'Fort Worth, Texas',
        type: 'Army',
        capacity: 5000,
        currentOccupancy: 3200,
        status: 'Operational',
        coordinates: { latitude: 32.7555, longitude: -97.3308 },
        facilities: ['Barracks', 'Hospital', 'Armory', 'Training Ground', 'Airstrip'],
        description: 'Primary army installation for southern command operations.'
      },
      {
        name: 'Camp Thunder',
        location: 'Fort Bragg, North Carolina',
        type: 'Army',
        capacity: 3500,
        currentOccupancy: 2800,
        status: 'Operational',
        coordinates: { latitude: 35.1391, longitude: -79.0064 },
        facilities: ['Barracks', 'Armory', 'Range', 'Motor Pool'],
        description: 'Special operations and airborne training facility.'
      },
      {
        name: 'Naval Station Trident',
        location: 'San Diego, California',
        type: 'Navy',
        capacity: 4000,
        currentOccupancy: 2600,
        status: 'Operational',
        coordinates: { latitude: 32.6837, longitude: -117.1781 },
        facilities: ['Docks', 'Barracks', 'Hospital', 'Communications Center'],
        description: 'Pacific fleet naval operations hub.'
      },
      {
        name: 'Eagle Air Base',
        location: 'Colorado Springs, Colorado',
        type: 'AirForce',
        capacity: 2500,
        currentOccupancy: 1800,
        status: 'Operational',
        coordinates: { latitude: 38.8339, longitude: -104.8214 },
        facilities: ['Hangars', 'Runway', 'Control Tower', 'Barracks', 'Fuel Depot'],
        description: 'Strategic air defense and fighter wing operations.'
      },
      {
        name: 'Joint Base Horizon',
        location: 'Norfolk, Virginia',
        type: 'Joint',
        capacity: 6000,
        currentOccupancy: 4500,
        status: 'Operational',
        coordinates: { latitude: 36.8508, longitude: -76.2859 },
        facilities: ['Docks', 'Barracks', 'HQ Command Center', 'Hospital', 'Armory', 'Airstrip'],
        description: 'Multi-service joint operations command center.'
      },
      {
        name: 'Camp Valor Training Center',
        location: 'Killeen, Texas',
        type: 'Training',
        capacity: 2000,
        currentOccupancy: 950,
        status: 'Operational',
        coordinates: { latitude: 31.1171, longitude: -97.7278 },
        facilities: ['Training Fields', 'Classroom', 'Obstacle Course', 'Barracks'],
        description: 'Primary basic and advanced individual training facility.'
      }
    ]);
    console.log(`✓ Bases seeded (${bases.length})`);

    // ── 3. Soldiers (6) — needed before Units (for commanders) ────────
    await Soldier.deleteMany({});
    const soldiers = await Soldier.insertMany([
      {
        serviceId: 'SVC-1001',
        firstName: 'James',
        lastName: 'Martinez',
        rank: rankId('COL'),
        base: bases[0]._id,
        dateOfBirth: new Date('1975-03-15'),
        dateOfEnlistment: new Date('1996-06-01'),
        specialization: 'Infantry',
        status: 'Active',
        contactEmail: 'j.martinez@mil.gov',
        contactPhone: '+1-555-0101'
      },
      {
        serviceId: 'SVC-1002',
        firstName: 'Sarah',
        lastName: 'Chen',
        rank: rankId('MAJ'),
        base: bases[1]._id,
        dateOfBirth: new Date('1982-07-22'),
        dateOfEnlistment: new Date('2004-08-15'),
        specialization: 'Special Forces',
        status: 'Active',
        contactEmail: 's.chen@mil.gov',
        contactPhone: '+1-555-0102'
      },
      {
        serviceId: 'SVC-1003',
        firstName: 'Robert',
        lastName: 'Johnson',
        rank: rankId('CPT'),
        base: bases[2]._id,
        dateOfBirth: new Date('1988-11-08'),
        dateOfEnlistment: new Date('2010-01-20'),
        specialization: 'Logistics',
        status: 'Deployed',
        contactEmail: 'r.johnson@mil.gov',
        contactPhone: '+1-555-0103'
      },
      {
        serviceId: 'SVC-1004',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        rank: rankId('SGT'),
        base: bases[3]._id,
        dateOfBirth: new Date('1993-04-30'),
        dateOfEnlistment: new Date('2014-05-10'),
        specialization: 'Medic',
        status: 'Active',
        contactEmail: 'e.rodriguez@mil.gov',
        contactPhone: '+1-555-0104'
      },
      {
        serviceId: 'SVC-1005',
        firstName: 'Michael',
        lastName: 'Thompson',
        rank: rankId('CPL'),
        base: bases[4]._id,
        dateOfBirth: new Date('1996-09-14'),
        dateOfEnlistment: new Date('2018-03-22'),
        specialization: 'Engineering',
        status: 'OnLeave',
        contactEmail: 'm.thompson@mil.gov',
        contactPhone: '+1-555-0105'
      },
      {
        serviceId: 'SVC-1006',
        firstName: 'David',
        lastName: 'Williams',
        rank: rankId('BG'),
        base: bases[4]._id,
        dateOfBirth: new Date('1970-01-25'),
        dateOfEnlistment: new Date('1992-06-15'),
        specialization: 'Strategic Command',
        status: 'Active',
        contactEmail: 'd.williams@mil.gov',
        contactPhone: '+1-555-0106',
        notes: 'Joint Base Horizon commanding officer.'
      }
    ]);
    console.log(`✓ Soldiers seeded (${soldiers.length})`);

    // ── 4. Units (6) ────────────────────────────────────────────────────
    await Unit.deleteMany({});
    const units = await Unit.insertMany([
      {
        name: '1st Infantry Battalion',
        type: 'Infantry',
        base: bases[0]._id,
        commander: soldiers[0]._id,
        capacity: 800,
        currentStrength: 650,
        status: 'Active',
        description: 'Primary ground combat force for Fort Sentinel.',
        establishedDate: new Date('1985-04-10')
      },
      {
        name: '3rd Special Operations Group',
        type: 'Special Forces',
        base: bases[1]._id,
        commander: soldiers[1]._id,
        capacity: 300,
        currentStrength: 245,
        status: 'Deployed',
        description: 'Elite special operations unit for counter-terrorism.',
        establishedDate: new Date('1998-09-15')
      },
      {
        name: '7th Logistics Regiment',
        type: 'Logistics',
        base: bases[2]._id,
        commander: soldiers[2]._id,
        capacity: 500,
        currentStrength: 420,
        status: 'Active',
        description: 'Supply chain and transport support for Pacific operations.',
        establishedDate: new Date('2001-01-20')
      },
      {
        name: '12th Medical Company',
        type: 'Medical',
        base: bases[3]._id,
        commander: null,
        capacity: 200,
        currentStrength: 165,
        status: 'Active',
        description: 'Primary field medical and trauma support unit.',
        establishedDate: new Date('2005-06-12')
      },
      {
        name: '5th Engineering Battalion',
        type: 'Engineering',
        base: bases[4]._id,
        commander: soldiers[4]._id,
        capacity: 400,
        currentStrength: 310,
        status: 'Active',
        description: 'Combat engineering and construction operations.',
        establishedDate: new Date('1990-08-05')
      },
      {
        name: '2nd Armor Division',
        type: 'Armor',
        base: bases[0]._id,
        commander: null,
        capacity: 600,
        currentStrength: 480,
        status: 'StandBy',
        description: 'Heavy armor operations and armored vehicle support.',
        establishedDate: new Date('1988-11-30')
      }
    ]);
    console.log(`✓ Units seeded (${units.length})`);

    // Assign units to soldiers
    await Soldier.updateOne({ _id: soldiers[0]._id }, { unit: units[0]._id });
    await Soldier.updateOne({ _id: soldiers[1]._id }, { unit: units[1]._id });
    await Soldier.updateOne({ _id: soldiers[2]._id }, { unit: units[2]._id });
    await Soldier.updateOne({ _id: soldiers[3]._id }, { unit: units[3]._id });
    await Soldier.updateOne({ _id: soldiers[4]._id }, { unit: units[4]._id });
    await Soldier.updateOne({ _id: soldiers[5]._id }, { unit: units[0]._id });
    console.log('  → Soldiers linked to units');

    // ── 5. Equipment (6) ────────────────────────────────────────────────
    await Equipment.deleteMany({});
    const equipment = await Equipment.insertMany([
      {
        name: 'M1A2 Abrams Tank',
        serialNumber: 'EQ-VEH-001',
        type: 'Vehicle',
        category: 'Heavy Armor',
        base: bases[0]._id,
        assignedUnit: units[5]._id,
        status: 'Operational',
        condition: 'Good',
        quantity: 12,
        acquisitionDate: new Date('2018-03-15'),
        lastMaintenanceDate: new Date('2025-11-20'),
        nextMaintenanceDate: new Date('2026-05-20'),
        notes: 'Main battle tank fleet for 2nd Armor Division.'
      },
      {
        name: 'M4A1 Carbine Rifles',
        serialNumber: 'EQ-WPN-001',
        type: 'Weapon',
        category: 'Small Arms',
        base: bases[0]._id,
        assignedUnit: units[0]._id,
        status: 'Operational',
        condition: 'New',
        quantity: 500,
        acquisitionDate: new Date('2020-06-01'),
        lastMaintenanceDate: new Date('2026-01-10'),
        nextMaintenanceDate: new Date('2026-07-10')
      },
      {
        name: 'AN/PRC-152 Radio Set',
        serialNumber: 'EQ-COM-001',
        type: 'Communication',
        category: 'Tactical Radio',
        base: bases[1]._id,
        assignedUnit: units[1]._id,
        status: 'Operational',
        condition: 'Good',
        quantity: 80,
        acquisitionDate: new Date('2021-09-10'),
        lastMaintenanceDate: new Date('2025-12-01'),
        nextMaintenanceDate: new Date('2026-06-01')
      },
      {
        name: 'Field Surgical Kit (Advanced)',
        serialNumber: 'EQ-MED-001',
        type: 'Medical',
        category: 'Surgical Equipment',
        base: bases[3]._id,
        assignedUnit: units[3]._id,
        status: 'Operational',
        condition: 'New',
        quantity: 30,
        acquisitionDate: new Date('2025-08-20'),
        lastMaintenanceDate: new Date('2025-08-20'),
        nextMaintenanceDate: new Date('2026-08-20')
      },
      {
        name: 'HMMWV (Humvee)',
        serialNumber: 'EQ-VEH-002',
        type: 'Vehicle',
        category: 'Utility Vehicle',
        base: bases[4]._id,
        assignedUnit: units[4]._id,
        status: 'UnderMaintenance',
        condition: 'Fair',
        quantity: 25,
        acquisitionDate: new Date('2015-02-28'),
        lastMaintenanceDate: new Date('2025-10-15'),
        nextMaintenanceDate: new Date('2026-01-15'),
        notes: 'Fleet undergoing scheduled engine overhaul.'
      },
      {
        name: 'D7R Combat Bulldozer',
        serialNumber: 'EQ-ENG-001',
        type: 'Engineering',
        category: 'Heavy Construction',
        base: bases[4]._id,
        assignedUnit: units[4]._id,
        status: 'Damaged',
        condition: 'Poor',
        quantity: 3,
        acquisitionDate: new Date('2012-07-14'),
        lastMaintenanceDate: new Date('2025-06-20'),
        nextMaintenanceDate: new Date('2025-12-20'),
        notes: 'Track and hydraulic system damage from field operations.'
      }
    ]);
    console.log(`✓ Equipment seeded (${equipment.length})`);

    // ── 6. Missions (6) ─────────────────────────────────────────────────
    await Mission.deleteMany({});
    const missions = await Mission.insertMany([
      {
        name: 'Operation Thunder Strike',
        code: 'OPS-2026-001',
        type: 'Combat',
        status: 'Active',
        priority: 'Critical',
        description: 'Large-scale joint combat operation in contested territory.',
        location: 'Eastern Mediterranean',
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-06-30'),
        commander: soldiers[0]._id,
        assignedUnits: [units[0]._id, units[5]._id],
        personnelCount: 1200,
        objectives: ['Secure forward operating base', 'Neutralize hostile positions', 'Establish perimeter defense'],
        notes: 'Joint operation with allied forces.'
      },
      {
        name: 'Operation Silent Watch',
        code: 'OPS-2026-002',
        type: 'Reconnaissance',
        status: 'Active',
        priority: 'High',
        description: 'Covert surveillance and intelligence gathering mission.',
        location: 'Central Asia',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-04-30'),
        commander: soldiers[1]._id,
        assignedUnits: [units[1]._id],
        personnelCount: 60,
        objectives: ['Gather intelligence on hostile movements', 'Establish surveillance network', 'Report findings to HQ']
      },
      {
        name: 'Operation Lifeline',
        code: 'OPS-2026-003',
        type: 'Humanitarian',
        status: 'Active',
        priority: 'High',
        description: 'Disaster relief and humanitarian aid distribution.',
        location: 'Southeast Asia',
        startDate: new Date('2026-01-20'),
        endDate: new Date('2026-03-31'),
        commander: soldiers[2]._id,
        assignedUnits: [units[2]._id, units[3]._id],
        personnelCount: 350,
        objectives: ['Distribute medical supplies', 'Set up field hospitals', 'Coordinate with local authorities']
      },
      {
        name: 'Exercise Iron Shield',
        code: 'OPS-2026-004',
        type: 'Training',
        status: 'Planning',
        priority: 'Medium',
        description: 'Multi-unit combined arms training exercise.',
        location: 'Camp Valor Training Center, Texas',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-04-21'),
        commander: soldiers[0]._id,
        assignedUnits: [units[0]._id, units[4]._id, units[5]._id],
        personnelCount: 2000,
        objectives: ['Test combined arms coordination', 'Evaluate new equipment', 'Develop tactical procedures']
      },
      {
        name: 'Operation Blue Horizon',
        code: 'OPS-2025-010',
        type: 'Peacekeeping',
        status: 'Completed',
        priority: 'Medium',
        description: 'Peacekeeping and stabilization mission in conflict zone.',
        location: 'West Africa',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-12-15'),
        commander: soldiers[5]._id,
        assignedUnits: [units[0]._id, units[2]._id],
        personnelCount: 800,
        objectives: ['Maintain ceasefire', 'Support local governance', 'Protect civilian population'],
        notes: 'Successfully completed with zero casualties.'
      },
      {
        name: 'Operation Supply Chain',
        code: 'OPS-2026-005',
        type: 'Logistics',
        status: 'OnHold',
        priority: 'Low',
        description: 'Strategic resupply and equipment redistribution across bases.',
        location: 'Continental US',
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-07-31'),
        commander: soldiers[2]._id,
        assignedUnits: [units[2]._id],
        personnelCount: 150,
        objectives: ['Redistribute excess equipment', 'Resupply forward positions', 'Audit inventory']
      }
    ]);
    console.log(`✓ Missions seeded (${missions.length})`);

    // ── Summary ─────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════');
    console.log('  MRMS Sample Data Seeded Successfully!');
    console.log('════════════════════════════════════════');
    console.log(`  Ranks:     ${ranks.length}`);
    console.log(`  Bases:     ${bases.length}`);
    console.log(`  Soldiers:  ${soldiers.length}`);
    console.log(`  Units:     ${units.length}`);
    console.log(`  Equipment: ${equipment.length}`);
    console.log(`  Missions:  ${missions.length}`);
    console.log('════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
