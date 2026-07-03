function resultForMatch(match) {
  if (match.homeScore > match.awayScore) return 'home';
  if (match.homeScore < match.awayScore) return 'away';
  return 'draw';
}

export function getAnalysis(matches = [], teams = []) {
  const finished = matches.filter((m) => m.status === 'finished');

  const teamNames = [...new Set(finished.flatMap((m) => [m.homeTeam, m.awayTeam]))];

  const teamStats = teamNames.map((name) => {
    const played = finished.filter((m) => m.homeTeam === name || m.awayTeam === name);
    const goalsFor = played.reduce((t, m) => t + (m.homeTeam === name ? m.homeScore : m.awayScore), 0);
    const goalsAgainst = played.reduce((t, m) => t + (m.homeTeam === name ? m.awayScore : m.homeScore), 0);
    const wins = played.filter((m) => {
      const r = resultForMatch(m);
      return (r === 'home' && m.homeTeam === name) || (r === 'away' && m.awayTeam === name);
    }).length;
    const draws = played.filter((m) => resultForMatch(m) === 'draw').length;
    const losses = played.length - wins - draws;
    const points = wins * 3 + draws;
    const teamInfo = teams.find((t) => t.name === name);

    return {
      team: name,
      country: teamInfo?.country || '',
      matchesPlayed: played.length,
      goalsFor,
      goalsAgainst,
      goalDiff: goalsFor - goalsAgainst,
      wins,
      draws,
      losses,
      points
    };
  });

  const totalGoals = finished.reduce((s, m) => s + m.homeScore + m.awayScore, 0);
  const homeWins = finished.filter((m) => resultForMatch(m) === 'home').length;
  const awayWins = finished.filter((m) => resultForMatch(m) === 'away').length;
  const draws = finished.filter((m) => resultForMatch(m) === 'draw').length;

  const sortedByDate = [...finished].sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate));
  const goalsTrend = sortedByDate.map((m) => ({
    match: `${m.homeTeam.split(' ')[0]}-${m.awayTeam.split(' ')[0]}`,
    goals: m.homeScore + m.awayScore,
    date: m.matchDate
  }));

  const topAttack = [...teamStats].sort((a, b) => b.goalsFor - a.goalsFor).slice(0, 3);
  const topDefense = [...teamStats].sort((a, b) => a.goalsAgainst - b.goalsAgainst).slice(0, 3);
  const mostEfficient = [...teamStats].sort((a, b) => (b.points / Math.max(b.matchesPlayed, 1)) - (a.points / Math.max(a.matchesPlayed, 1)))[0];

  return {
    summary: {
      matchesPlayed: finished.length,
      totalGoals,
      avgGoalsPerMatch: finished.length ? Number((totalGoals / finished.length).toFixed(2)) : 0,
      homeWins,
      awayWins,
      draws,
      topAttackTeam: topAttack[0]?.team || null,
      topDefenseTeam: topDefense[0]?.team || null,
      mostEfficientTeam: mostEfficient?.team || null
    },
    teamStats,
    topAttack,
    topDefense,
    goalsTrend,
    resultDistribution: [
      { name: 'Home wins', value: homeWins },
      { name: 'Draws', value: draws },
      { name: 'Away wins', value: awayWins }
    ],
    insights: [
      `${topAttack[0]?.team || 'A team'} has the strongest attack with ${topAttack[0]?.goalsFor ?? 0} goals scored.`,
      `${topDefense[0]?.team || 'A team'} has the best defense with only ${topDefense[0]?.goalsAgainst ?? 0} goals conceded.`,
      `Average goals per match is ${finished.length ? (totalGoals / finished.length).toFixed(2) : '0.00'}.`
    ]
  };
}
