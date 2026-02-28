const pool = require("./index"); // ან საიდანაც pool გაქვს

async function createProject({ userId, name }) {
  const { rows } = await pool.query(
    `INSERT INTO projects (user_id, name)
     VALUES ($1, $2)
     RETURNING id, user_id, name, created_at`,
    [userId, name]
  );
  return rows[0];
}

async function listProjectsByUser(userId) {
  const { rows } = await pool.query(
    `SELECT id, user_id, name, created_at
     FROM projects
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

async function findProjectById(id) {
  const { rows } = await pool.query(
    `SELECT id, user_id, name, created_at
     FROM projects
     WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { createProject, listProjectsByUser, findProjectById };