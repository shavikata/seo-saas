const db = require("./index");

async function findUserByEmail(email) {
  const result = await db.query(
    "SELECT id, email, password_hash, full_name, created_at FROM users WHERE email=$1",
    [email]
  );
  return result.rows[0] || null;
}

async function findUserById(id) {
  // Select only safe fields. Never return password_hash.
  const result = await db.query(
    `
    SELECT id, email, full_name, created_at
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function createUser({ email, passwordHash, fullName }) {
  const result = await db.query(
    `
    INSERT INTO users (email, password_hash, full_name)
    VALUES ($1, $2, $3)
    RETURNING id, email, full_name, created_at
    `,
    [email, passwordHash, fullName || null]
  );

  return result.rows[0];
}
async function findUserById(id) {
  const { rows } = await pool.query(
    "SELECT id, email, full_name, created_at FROM users WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}
module.exports = { findUserByEmail, findUserById, createUser };