/**
 * Rank Seed Script
 * Populates the database with standard military ranks.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Rank = require('../models/Rank');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/military-asset-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const ranks = [
  // Enlisted
  { name: 'Private', abbreviation: 'PVT', level: 1, category: 'Enlisted', payGrade: 'E-1', description: 'Entry-level enlisted rank' },
  { name: 'Private Second Class', abbreviation: 'PV2', level: 2, category: 'Enlisted', payGrade: 'E-2', description: 'Junior enlisted rank' },
  { name: 'Private First Class', abbreviation: 'PFC', level: 3, category: 'Enlisted', payGrade: 'E-3', description: 'Experienced junior enlisted' },
  { name: 'Specialist', abbreviation: 'SPC', level: 4, category: 'Enlisted', payGrade: 'E-4', description: 'Senior enlisted specialist' },

  // NCO
  { name: 'Corporal', abbreviation: 'CPL', level: 5, category: 'NCO', payGrade: 'E-4', description: 'Junior non-commissioned officer' },
  { name: 'Sergeant', abbreviation: 'SGT', level: 6, category: 'NCO', payGrade: 'E-5', description: 'Non-commissioned officer' },
  { name: 'Staff Sergeant', abbreviation: 'SSG', level: 7, category: 'NCO', payGrade: 'E-6', description: 'Senior non-commissioned officer' },
  { name: 'Sergeant First Class', abbreviation: 'SFC', level: 8, category: 'NCO', payGrade: 'E-7', description: 'Senior NCO, platoon sergeant' },
  { name: 'Master Sergeant', abbreviation: 'MSG', level: 9, category: 'NCO', payGrade: 'E-8', description: 'Senior NCO, operations sergeant' },
  { name: 'First Sergeant', abbreviation: '1SG', level: 10, category: 'NCO', payGrade: 'E-8', description: 'Senior NCO, company first sergeant' },
  { name: 'Sergeant Major', abbreviation: 'SGM', level: 11, category: 'NCO', payGrade: 'E-9', description: 'Senior enlisted advisor' },
  { name: 'Command Sergeant Major', abbreviation: 'CSM', level: 12, category: 'NCO', payGrade: 'E-9', description: 'Senior enlisted advisor to commanders' },

  // Officer
  { name: 'Second Lieutenant', abbreviation: '2LT', level: 13, category: 'Officer', payGrade: 'O-1', description: 'Junior commissioned officer' },
  { name: 'First Lieutenant', abbreviation: '1LT', level: 14, category: 'Officer', payGrade: 'O-2', description: 'Commissioned officer' },
  { name: 'Captain', abbreviation: 'CPT', level: 15, category: 'Officer', payGrade: 'O-3', description: 'Company commander' },
  { name: 'Major', abbreviation: 'MAJ', level: 16, category: 'Officer', payGrade: 'O-4', description: 'Field grade officer' },
  { name: 'Lieutenant Colonel', abbreviation: 'LTC', level: 17, category: 'Officer', payGrade: 'O-5', description: 'Battalion commander' },
  { name: 'Colonel', abbreviation: 'COL', level: 18, category: 'Officer', payGrade: 'O-6', description: 'Brigade commander' },

  // General
  { name: 'Brigadier General', abbreviation: 'BG', level: 19, category: 'General', payGrade: 'O-7', description: 'One-star general officer' },
  { name: 'Major General', abbreviation: 'MG', level: 20, category: 'General', payGrade: 'O-8', description: 'Two-star general officer' },
  { name: 'Lieutenant General', abbreviation: 'LTG', level: 21, category: 'General', payGrade: 'O-9', description: 'Three-star general officer' },
  { name: 'General', abbreviation: 'GEN', level: 22, category: 'General', payGrade: 'O-10', description: 'Four-star general officer' },
];

async function seedRanks() {
  try {
    // Clear existing ranks
    await Rank.deleteMany({});
    console.log('Cleared existing ranks');

    // Insert all ranks
    const created = await Rank.insertMany(ranks);
    console.log(`Successfully seeded ${created.length} military ranks:`);

    // Display summary by category
    const categories = ['Enlisted', 'NCO', 'Officer', 'General'];
    for (const cat of categories) {
      const count = created.filter(r => r.category === cat).length;
      console.log(`  ${cat}: ${count} ranks`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding ranks:', error);
    process.exit(1);
  }
}

seedRanks();
