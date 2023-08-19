import {} from 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function executeQuery(query, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query(query, params);
    return results;
  } finally {
    connection.release();
  }
}

export { executeQuery };