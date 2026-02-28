const pool = require("./index");

async function addKeyword({ projectId, keyword, country = "GE", language = "ka" }) {
  const { rows } = await pool.query(
    `INSERT INTO keywords (project_id, keyword, country, language)
     VALUES ($1, $2, $3, $4)
     RETURNING id, project_id, keyword, country, language, created_at`,
    [projectId, keyword, country, language]
  );
  return rows[0];
}

async function listKeywords(projectId) {
  const { rows } = await pool.query(
    `SELECT id, project_id, keyword, country, language, created_at
     FROM keywords
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [projectId]
  );
  return rows;
}

async function insertKeywordResult({ keywordId, score, difficulty, volume, notes = null }) {
  const { rows } = await pool.query(
    `INSERT INTO keyword_results (keyword_id, score, difficulty, volume, notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, keyword_id, checked_at, score, difficulty, volume, notes`,
    [keywordId, score, difficulty, volume, notes]
  );
  return rows[0];
}

async function latestResult(keywordId) {
  const { rows } = await pool.query(
    `SELECT id, checked_at, score, difficulty, volume, notes
     FROM keyword_results
     WHERE keyword_id = $1
     ORDER BY checked_at DESC
     LIMIT 1`,
    [keywordId]
  );
  return rows[0] || null;
}

module.exports = { addKeyword, listKeywords, insertKeywordResult, latestResult };