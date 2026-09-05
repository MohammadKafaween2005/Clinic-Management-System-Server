import pg from "pg";

const { Pool, types } = pg;

// PostgreSQL DATE type = 1082
// Keep DATE values as YYYY-MM-DD instead of converting them to UTC dates
types.setTypeParser(1082, (value) => value); //THIS WAS DONE SO DATES ARE CORRECT

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
