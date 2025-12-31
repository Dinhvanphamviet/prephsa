
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function updateSchema() {
  try {
    // Add email_verified to users if not exists
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_verified TIMESTAMP;
    `);
    console.log("Added email_verified to users table");

    // Create verification_tokens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `);
    console.log("Created verification_tokens table");

  } catch (err) {
    console.error("Error updating schema:", err);
  } finally {
    await pool.end();
  }
}

updateSchema();
