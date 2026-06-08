// fix-translation-cache.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

const r1 = await db.collection('livestocks').updateMany(
  {}, { $set: { translations: {} } }
);
console.log(`✅ Livestock: cache vidé pour ${r1.modifiedCount} documents`);

const r2 = await db.collection('livestockcategories').updateMany(
  {}, { $set: { translations: {} } }
);
console.log(`✅ Categories: cache vidé pour ${r2.modifiedCount} documents`);

await mongoose.disconnect();
console.log('Done!');