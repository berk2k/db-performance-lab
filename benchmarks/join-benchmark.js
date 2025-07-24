require('dotenv').config();
const { Client } = require('pg');

const totalQueries = parseInt(process.argv[2]) || 1000;
const testCase = process.argv[3] || 'join-simple'; // 'join-simple' or 'join-unnecessary'
const indexStatus = process.argv[4] || 'DISABLED';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runJoinBenchmark() {
  console.log('=== JOIN BENCHMARK STARTED ===');
  console.log(`Total queries: ${totalQueries}`);
  console.log(`Test case: ${testCase}`);
  console.log(`Index status: ${indexStatus}`);
  await client.connect();
  console.log('Connected to database.');
  console.log('Starting JOIN queries...');

  let query;
  if (testCase === 'join-simple') {
    query = `
      SELECT t.id, t.amount, u.name
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.status = 'COMPLETED'
      LIMIT 100;
    `;
  } else if (testCase === 'join-unnecessary') {
    query = `
      SELECT t.id, t.amount, u.name, u.email
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN users u2 ON u2.id = t.user_id
      WHERE t.status = 'COMPLETED'
      LIMIT 100;
    `;
  } else {
    console.error('Invalid test case. Use "join-simple" or "join-unnecessary".');
    process.exit(1);
  }

  const progressInterval = 100;
  console.time('join');
  for (let i = 1; i <= totalQueries; i++) {
    await client.query(query);
    if (i % progressInterval === 0) {
      console.log(`${i} queries executed... (progress)`);
    }
  }
  console.timeEnd('join');
  console.log('Join benchmark finished.');

  await client.end();
  process.exit(0);
}

runJoinBenchmark();
