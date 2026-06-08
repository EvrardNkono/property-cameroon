import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection.db;
const col = db.collection('livestockcategories');

const all = await col.find({}).toArray();
console.log('Documents trouvés:', all.length);
all.forEach(doc => {
  console.log('slug:', JSON.stringify(doc.slug), '| title:', doc.title);
});

await mongoose.disconnect();