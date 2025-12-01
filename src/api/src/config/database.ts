import { Pool } from 'pg';

// Configuration PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Nombre maximum de clients dans le pool
  idleTimeoutMillis: 30000, // Ferme les connexions inactives après 30s
  connectionTimeoutMillis: 2000, // Timeout de connexion 2s
});

// Test connexion au démarrage
pool.on('connect', () => {
  console.log('✅ Nouvelle connexion PostgreSQL établie');
});

pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL inattendue:', err);
  process.exit(-1);
});

// Test initial
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err);
    process.exit(-1);
  }
  console.log('✅ Base de données connectée:', res.rows[0].now);
});

export default pool;
