import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash('@soa2026', 10);
    
    const result = await mongoose.connection.collection('users').updateOne(
      { email: 'admin@propertycameroon.com' },
      {
        $set: {
          name: 'Super Admin',
          email: 'admin@propertycameroon.com',
          password: hashedPassword,
          phone: '+237 690000000',
          roles: ['ADMIN', 'BUYER', 'OWNER', 'INVESTOR'],
          status: 'Verified',
          kycStatus: 'Verified',
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log('✅ Admin corrigé/mis à jour!');
    console.log('📧 Email: admin@propertycameroon.com');
    console.log('🔑 Mot de passe: @soa2026');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

fixAdmin();