const router = require("express").Router();
const { requireAuth } = require("../middleware/auth.middleware");
const { createProject, listProjectsByUser, findProjectById } = require("../db/projects.db");
const { addKeyword, listKeywords, insertKeywordResult, latestResult } = require("../db/keywords.db");
const { scoreKeyword } = require("../services/ranking.service");

// Create project
router.post("/projects", requireAuth, async (req, res) => {
  const name = (req.body?.name || "").trim();
  if (!name) return res.status(400).json({ error: "project name is required" });

  const project = await createProject({ userId: req.user.id, name });
  return res.status(201).json({ project });
});

// List my projects
router.get("/projects", requireAuth, async (req, res) => {
  const projects = await listProjectsByUser(req.user.id);
  return res.json({ projects });
});

// Add keyword to a project
router.post("/projects/:projectId/keywords", requireAuth, async (req, res) => {
  const { projectId } = req.params;
  const project = await findProjectById(projectId);
  if (!project || project.user_id !== req.user.id) {
    return res.status(404).json({ error: "project not found" });
  }

  const keyword = (req.body?.keyword || "").trim();
  if (!keyword) return res.status(400).json({ error: "keyword is required" });

  const country = (req.body?.country || "GE").trim();
  const language = (req.body?.language || "ka").trim();

  const kw = await addKeyword({ projectId, keyword, country, language });

  // instantly “analyze” and save a result (mock)
  const { score, difficulty, volume, notes } = scoreKeyword(keyword);
  const result = await insertKeywordResult({ keywordId: kw.id, score, difficulty, volume, notes });

  return res.status(201).json({ keyword: kw, result });
});

// List keywords (+ latest result) for a project
router.get("/projects/:projectId/keywords", requireAuth, async (req, res) => {
  const { projectId } = req.params;
  const project = await findProjectById(projectId);
  if (!project || project.user_id !== req.user.id) {
    return res.status(404).json({ error: "project not found" });
  }

  const keywords = await listKeywords(projectId);

  // attach latest result (simple approach)
  const enriched = [];
  for (const k of keywords) {
    const r = await latestResult(k.id);
    enriched.push({ ...k, latest: r });
  }

  return res.json({ keywords: enriched });
});

module.exports = router;