// backend/check-categories.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LivestockCategory from './models/LivestockCategory.model.js';

dotenv.config();

const checkCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const categories = await LivestockCategory.find({});
    
    console.log(`📊 Categories found: ${categories.length}\n`);
    
    if (categories.length === 0) {
      console.log('❌ NO CATEGORIES FOUND!');
      console.log('\n💡 You need to create the categories first.');
      console.log('   Go to Dashboard → Admin → Livestock Categories');
      console.log('   Or run the create-categories.js script');
    } else {
      console.log('Existing categories:');
      categories.forEach(cat => {
        console.log(`   - ${cat.slug}: ${cat.title} (Active: ${cat.isActive})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkCategories();