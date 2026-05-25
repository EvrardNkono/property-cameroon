import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://evrardnkono870_db_user:Chesstitant1@cluster0.wkjstac.mongodb.net/?retryWrites=true&w=majority';

async function testConnection() {
  console.log('🔄 Test de connexion à MongoDB Atlas...');
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    family: 4,
    tls: true
  });
  
  try {
    await client.connect();
    console.log('✅ CONNEXION RÉUSSIE !');
    
    // Lister les bases de données
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log('📊 Bases de données disponibles:', dbs.databases.map(db => db.name));
    
    await client.close();
    console.log('👋 Connexion fermée');
  } catch (error) {
    console.error('❌ ÉCHEC DE CONNEXION');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    if (error.cause) console.error('Cause:', error.cause);
  }
}

testConnection();