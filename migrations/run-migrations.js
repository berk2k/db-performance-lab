require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('PostgreSQL connection successful. Starting Migration...');

    const sql = fs.readFileSync(path.join(__dirname, 'create-tables.sql'), 'utf-8');
    await client.query(sql);

    console.log('Migration completed!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
}

runMigrations();
