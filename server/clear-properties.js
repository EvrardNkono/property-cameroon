// server/clear-properties.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const clearProperties = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await mongoose.connection.collection('properties').deleteMany({});
    console.log(`✅ ${result.deletedCount} propriété(s) supprimée(s)`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

clearProperties();