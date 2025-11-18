// "node resetDb.js" to run this script

const fs = require('fs');
const path = require('path');

// Load better-sqlite3 from backend node_modules
const Database = require(path.join(__dirname, '../backend/node_modules/better-sqlite3'));

const dbPath = path.join(__dirname, 'nextgenlock.db');

// Delete existing database
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Deleted existing database');
}

// Create new database
const db = new Database(dbPath);
console.log('Created new database');

// Read and execute setupTables.sql
const setupSQL = fs.readFileSync(path.join(__dirname, 'setupTables.sql'), 'utf-8');
db.exec(setupSQL);
console.log('Tables created');

// Read and execute generateMockup.sql
const mockupSQL = fs.readFileSync(path.join(__dirname, 'generateMockup.sql'), 'utf-8');
db.exec(mockupSQL);
console.log('Mock data inserted');

db.close();
console.log('Database reset complete!');
