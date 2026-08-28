import { getInitialSeedData, saveDb } from './db.js';

console.log('🌱 Starting database seeding for Nusantara Wayang...');
const seedData = getInitialSeedData();
saveDb(seedData);

console.log('✅ Database seeded successfully with:');
console.log(`- ${seedData.users.length} Admin User (admin@example.local / ChangeMe123!)`);
console.log(`- ${seedData.categories.length} Categories`);
console.log(`- ${seedData.products.length} Products`);
console.log(`- ${seedData.branches.length} Branches`);
console.log(`- ${seedData.gallery.length} Gallery items`);
console.log('- Company Profile & Site Settings initialized.');
