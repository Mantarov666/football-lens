import { Router } from 'express';
import { authMiddleware, signToken } from './auth.js';
import { getAnalysis } from './analysis.js';
import { getMatches, getStats, getTeams } from './footballApi.js';
import { getExpertPredictions, getPublicPredictions } from './predictions.js';
import { createUser, findUserByEmail, findUserById, updateFavoriteTeam, validatePassword } from './users.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'football-stats-api' });
});

router.post('/auth/register', async (req, res) => {
  const { email, password, fullName, favoriteTeam } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const user = await createUser({ email, password, fullName, favoriteTeam });

  const token = signToken(user);
  return res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      favoriteTeam: user.favoriteTeam
    }
  });
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await validatePassword(user, password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user);
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      favoriteTeam: user.favoriteTeam
    }
  });
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = await findUserById(req.user.sub);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    favoriteTeam: user.favoriteTeam
  });
});

router.put('/me/favorite-team', authMiddleware, async (req, res) => {
  const { favoriteTeam } = req.body;
  const user = await updateFavoriteTeam(req.user.sub, favoriteTeam);

  if (!user || !favoriteTeam) {
    return res.status(400).json({ message: 'Invalid update request' });
  }

  return res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    favoriteTeam: user.favoriteTeam
  });
});

router.get('/teams', async (req, res) => {
  const teams = await getTeams();
  res.json(teams);
});

router.get('/matches', async (req, res) => {
  const matches = await getMatches();
  res.json(matches);
});

function calcOverview(stats) {
  const totalPlayed = stats.reduce((sum, t) => sum + t.played, 0);
  const totalWins   = stats.reduce((sum, t) => sum + t.won, 0);
  return {
    matchesPlayed: Math.round(totalPlayed / 2),
    goalsScored:   stats.reduce((sum, t) => sum + t.goalsFor, 0),
    cleanSheets:   stats.filter(t => t.goalsAgainst === 0).length,
    winRate:       totalPlayed > 0 ? Math.round((totalWins / totalPlayed) * 100) : 0
  };
}

router.get('/stats/overview', async (req, res) => {
  const stats = await getStats();
  res.json(calcOverview(stats));
});

router.get('/stats/standings', async (req, res) => {
  const stats = await getStats();
  res.json(stats);
});

router.get('/dashboard', async (req, res) => {
  const [teams, matches, stats] = await Promise.all([getTeams(), getMatches(), getStats()]);
  const { team } = req.query;

  const teamStats = team
    ? stats.filter(t => t.teamName.toLowerCase() === team.toLowerCase())
    : [];
  const overviewStats = teamStats.length > 0 ? teamStats : stats;

  res.json({
    teams,
    recentMatches: matches.slice(0, 3),
    overview: calcOverview(overviewStats),
    standings: [...stats].sort((a, b) => b.points - a.points).slice(0, 4).map(t => ({
      team: t.teamName,
      points: t.points
    }))
  });
});

router.get('/predictions', async (req, res) => {
  const [matches, teams] = await Promise.all([getMatches(), getTeams()]);
  const teamStats = getAnalysis(matches, teams).teamStats;
  res.json(getPublicPredictions(matches, teamStats));
});

router.get('/predictions/expert', authMiddleware, async (req, res) => {
  const [matches, teams] = await Promise.all([getMatches(), getTeams()]);
  const teamStats = getAnalysis(matches, teams).teamStats;
  res.json(getExpertPredictions(matches, teamStats));
});

router.get('/analysis', async (req, res) => {
  const [matches, teams] = await Promise.all([getMatches(), getTeams()]);
  res.json(getAnalysis(matches, teams));
});

export default router;
