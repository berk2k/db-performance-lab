require('dotenv').config();
const { Client } = require('pg');

const totalQueries = parseInt(process.argv[2]) || 1000;
const indexStatus = process.argv[3] || 'UNKNOWN';

async function runSelectBenchmark() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  console.log("=== SELECT BENCHMARK STARTED ===");
  console.log(`Total queries: ${totalQueries}`);
  console.log(`Index status: ${indexStatus}`);
  console.log("Connected to database.");
  console.log("Starting SELECT operations...");

  const userIds = Array.from({ length: totalQueries }, () => Math.floor(Math.random() * 1000));

  console.time("select");

  for (let i = 0; i < totalQueries; i++) {
    const userId = userIds[i];
    await client.query(
      `SELECT * FROM transactions
       WHERE user_id = $1 AND amount > 100
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );

    if ((i + 1) % 100 === 0) {
      console.log(`${i + 1} queries executed...`);
    }
  }

  console.timeEnd("select");
  console.log("=== SELECT BENCHMARK FINISHED ===");

  await client.end();
  process.exit(0);
}

runSelectBenchmark();
