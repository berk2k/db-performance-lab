const { Client } = require('pg');
require('dotenv').config();

async function benchmarkQuery(label, query) {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();

        console.log(`\nRunning benchmark: ${label}`);
        console.time(label);
        await client.query(query);
        console.timeEnd(label);
    } catch (err) {
        console.error(`Error during benchmark "${label}":`, err);
    } finally {
        await client.end();
    }
}

const queries = [
  {
    label: 'Basic filter',
    query: `
      SELECT * FROM transactions
      WHERE amount > 500 AND status = 'SUCCESS';
    `
  },
  {
    label: 'Filter + ORDER BY',
    query: `
      SELECT * FROM transactions
      WHERE amount > 500 AND status = 'SUCCESS'
      ORDER BY transaction_date DESC;
    `
  },
  {
    label: 'Filter + ORDER BY + LIMIT',
    query: `
      SELECT * FROM transactions
      WHERE amount > 500 AND status = 'SUCCESS'
      ORDER BY transaction_date DESC
      LIMIT 100;
    `
  }
];

(async () => {
    console.log('=== FILTERING BENCHMARK STARTED ===');
    for (const { label, query } of queries) {
        await benchmarkQuery(label, query);
    }
    console.log('\n=== FILTERING BENCHMARK FINISHED ===');
})();
