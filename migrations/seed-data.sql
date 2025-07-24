INSERT INTO transactions (user_id, amount, status, description)
SELECT
  (random()*1000)::int AS user_id,
  (random()*1000)::numeric(10,2) AS amount,
  CASE WHEN random() > 0.5 THEN 'COMPLETED' ELSE 'PENDING' END AS status,
  'Test transaction' AS description
FROM generate_series(1, 100);
