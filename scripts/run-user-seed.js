require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSeed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('PostgreSQL connection successful. Starting Seed...');

    const sql = fs.readFileSync('seeds/seed-users.sql', 'utf-8');
    await client.query(sql);

    console.log('Seeded!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await client.end();
  }
}

runSeed();
