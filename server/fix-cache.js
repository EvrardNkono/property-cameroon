import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const result = await mongoose.connection.collection('properties').updateMany(
  { 'translations.fr.amenities': { $exists: false } },
  { $unset: { 'translations.fr': '' } }
);

console.log('Propriétés modifiées :', result.modifiedCount);
await mongoose.disconnect();