require('dotenv').config();

const { Client } = require('pg');

const total = parseInt(process.argv[2]) || 100000;
const batchSize = parseInt(process.argv[3]) || 1000;
const indexStatus = process.argv[4] || 'UNKNOWN'; // e.g. "ENABLED" or "DISABLED"

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runBenchmark() {
  await client.connect();

  console.log('=== BENCHMARK TEST STARTED ===');
  console.log(`Total records to insert: ${total}`);
  console.log(`Batch size: ${batchSize}`);
  console.log(`Index status: ${indexStatus}`);
  console.log('Connected to database.');

  console.log('Starting INSERT operation...');
  console.time('insert');

  try {
    await client.query('BEGIN');

    for (let i = 0; i < total; i += batchSize) {
      const values = [];
      const params = [];
      for (let j = 0; j < batchSize; j++) {
        const idx = i + j;
        values.push(`($${params.length + 1}, $${params.length + 2}, $${params.length + 3}, $${params.length + 4})`);
        params.push(
          Math.floor(Math.random() * 1000),
          (Math.random() * 1000).toFixed(2),
          Math.random() > 0.5 ? 'COMPLETED' : 'PENDING',
          'Benchmark transaction'
        );
      }
      const query = `INSERT INTO transactions (user_id, amount, status, description) VALUES ${values.join(',')}`;
      await client.query(query, params);

      // Progress logging every 10 batches (~every 10,000 inserts if batchSize=1000)
      if ((i / batchSize + 1) % 10 === 0) {
        console.log(`${i + batchSize} records inserted... (progress)`);
      }
    }

    await client.query('COMMIT');

    console.timeEnd('insert');
    console.log('=== BENCHMARK TEST FINISHED ===');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during benchmark:', error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

runBenchmark();
