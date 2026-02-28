function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// MVP mock scoring (მუშაობს ყოველთვის)
// ლოგიკა: მოკლე keyword = ხშირად რთული, გრძელი long-tail = უფრო easy
function scoreKeyword(keyword) {
  const k = keyword.trim().toLowerCase();
  const words = k.split(/\s+/).filter(Boolean).length;
  const len = k.length;

  // "difficulty" 0-100
  let difficulty = 70 - words * 12 - Math.floor(len / 10);
  difficulty = clamp(difficulty, 5, 95);

  // "volume" fake estimate
  let volume = 2000 - words * 350 - Math.floor(len * 10);
  volume = clamp(volume, 20, 5000);

  // "score" 0-100 (კარგი keyword = მაღალი score)
  const score = clamp(Math.round((100 - difficulty) * 0.7 + (volume / 5000) * 30), 1, 99);

  return { score, difficulty, volume, notes: "Mock score (replace with SERP API later)" };
}

module.exports = { scoreKeyword };