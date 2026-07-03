import { mockExpertPredictions } from './mockData.js';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calculatePrediction(match, teamStats) {
  const home = teamStats.find((t) => t.team === match.homeTeam);
  const away = teamStats.find((t) => t.team === match.awayTeam);

  const homeGoalDiff = (home?.goalsFor || 0) - (home?.goalsAgainst || 0);
  const awayGoalDiff = (away?.goalsFor || 0) - (away?.goalsAgainst || 0);
  const homePoints = home?.points || 0;
  const awayPoints = away?.points || 0;
  const homeAdvantage = 4;

  const homePower = homePoints + homeAdvantage + Math.max(homeGoalDiff, 0);
  const awayPower = awayPoints + Math.max(awayGoalDiff, 0);
  const drawPower = clamp(8 - Math.abs(homePower - awayPower) * 0.35, 1, 20);

  const total = Math.max(homePower + awayPower + drawPower, 1);
  const homeWin = Math.round((homePower / total) * 100);
  const draw = Math.round((drawPower / total) * 100);
  const awayWin = Math.max(0, 100 - homeWin - draw);
  const winner = homeWin >= awayWin && homeWin >= draw ? match.homeTeam : awayWin >= draw ? match.awayTeam : 'Draw';
  const predictedScore = homeWin >= awayWin ? '2:1' : awayWin > homeWin ? '1:2' : '1:1';

  return {
    matchId: match.id,
    matchLabel: `${match.homeTeam} vs ${match.awayTeam}`,
    competition: match.competition,
    matchDate: match.matchDate,
    winner,
    predictedScore,
    probabilities: { homeWin, draw, awayWin },
    explanation: [
      `Prediction based on team performance in the current tournament.`,
      `The model uses goals scored/conceded and points accumulated.`,
      `This is a lightweight statistical prediction model.`
    ]
  };
}

export function getPublicPredictions(matches = [], teamStats = []) {
  return matches
    .filter((m) => m.status === 'scheduled')
    .slice(0, 10)
    .map((m) => calculatePrediction(m, teamStats));
}

export function getExpertPredictions(matches = [], teamStats = []) {
  return getPublicPredictions(matches, teamStats).map((prediction) => {
    const expert = mockExpertPredictions.find((item) => item.matchId === prediction.matchId);
    return {
      ...prediction,
      expertPrediction: expert
        ? { analyst: expert.analyst, pick: expert.pick, confidence: expert.confidence, note: expert.note }
        : null
    };
  });
}
