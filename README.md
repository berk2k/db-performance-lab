# 🧪 Database Performance Lab

This project is built to **learn, test, and document PostgreSQL database performance** under real-world conditions.

---

## ✅ Goal

Understand how indexing, batch size, data volume, and query type affect performance—useful for system design, scaling, and interview preparation.

---

# 🧪 Benchmark 1: Insert Performance (With vs Without Index)

With out index:

![benchmark](./benchmark_screenshots/insert_wo_index.PNG)

With index:

![benchmark](./benchmark_screenshots/insert_w_index.PNG)

---

## 📈 Results & Insights
During the tests, the same dataset was inserted into PostgreSQL with and without an index on the user_id column.

Without index: The operation completed faster since PostgreSQL only had to write data directly into the table.

With index: The operation took slightly longer because PostgreSQL had to maintain and update the index structure for each inserted row.

## 🧪 Benchmark Metrics
| Index Status | Total Records | Insert Duration | Difference        |
| ------------ | ------------- | --------------- | ----------------- |
| Disabled     | 100,000       | 1.923 seconds   | —                 |
| Enabled      | 100,000       | 2.265 seconds   | ⬆️ \~17.8% slower |

💡 Observation: Enabling an index on a high-volume insert workload increased total insert time by approximately 18%.

---

🧠 General Takeaways

➡️ If a table receives frequent inserts (e.g., event logs, transaction records), having too many indexes can negatively impact write performance due to the overhead of maintaining those indexes.

➡️ For write-heavy tables, index usage should be carefully planned. Consider deferring index creation until after bulk inserts are complete, or only keeping the most essential indexes.

⚠️ Keep in mind: Indexes greatly improve read/query performance. It’s always a trade-off between write speed and query efficiency, and the choice depends on your specific use case.
