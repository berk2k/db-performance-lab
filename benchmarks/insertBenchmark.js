const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testdb',
  password: 'yourpassword',
  port: 5432,
});

async function runBenchmark() {
  const client = await pool.connect();
  const total = 100000;
  const batchSize = 1000;

  try {
    console.log(`Starting insert benchmark: total ${total} records, batch size ${batchSize}`);
    console.time('insert');

    await client.query('BEGIN');

    for (let i = 0; i < total; i += batchSize) {
      const values = [];
      const params = [];
      for (let j = 0; j < batchSize; j++) {
        const index = i + j;
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
    }

    await client.query('COMMIT');

    console.timeEnd('insert');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error during benchmark:', e);
  } finally {
    client.release();
    process.exit(0);
  }
}

runBenchmark();
