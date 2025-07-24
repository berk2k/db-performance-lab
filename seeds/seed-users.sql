INSERT INTO users (name, email)
SELECT
  'User ' || i,
  'user' || i || '@example.com'
FROM generate_series(1, 1000) AS s(i);
