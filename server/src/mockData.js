export const mockTeams = [
  { id: 1, name: 'FC Barcelona', country: 'Spain', form: ['W', 'W', 'D', 'W', 'L'], goalsFor: 14, goalsAgainst: 6, points: 13 },
  { id: 2, name: 'Real Madrid', country: 'Spain', form: ['W', 'D', 'W', 'W', 'W'], goalsFor: 16, goalsAgainst: 4, points: 13 },
  { id: 3, name: 'Manchester City', country: 'England', form: ['W', 'L', 'W', 'D', 'W'], goalsFor: 13, goalsAgainst: 7, points: 10 },
  { id: 4, name: 'Bayern Munich', country: 'Germany', form: ['W', 'W', 'W', 'W', 'D'], goalsFor: 15, goalsAgainst: 5, points: 13 }
];

export const mockMatches = [
  {
    id: 'm1',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Real Madrid',
    homeScore: 2,
    awayScore: 1,
    competition: 'La Liga',
    status: 'finished',
    matchDate: '2026-06-10T18:00:00.000Z'
  },
  {
    id: 'm2',
    homeTeam: 'Bayern Munich',
    awayTeam: 'FC Barcelona',
    homeScore: 1,
    awayScore: 1,
    competition: 'Champions League',
    status: 'finished',
    matchDate: '2026-06-07T19:45:00.000Z'
  },
  {
    id: 'm3',
    homeTeam: 'Manchester City',
    awayTeam: 'Real Madrid',
    homeScore: 1,
    awayScore: 3,
    competition: 'Champions League',
    status: 'finished',
    matchDate: '2026-06-05T19:30:00.000Z'
  },
  {
    id: 'm4',
    homeTeam: 'Real Madrid',
    awayTeam: 'Bayern Munich',
    homeScore: 2,
    awayScore: 0,
    competition: 'Friendly',
    status: 'finished',
    matchDate: '2026-06-03T18:15:00.000Z'
  },
  {
    id: 'm5',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Manchester City',
    homeScore: 2,
    awayScore: 2,
    competition: 'Friendly',
    status: 'finished',
    matchDate: '2026-06-02T18:00:00.000Z'
  },
  {
    id: 'm6',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Manchester City',
    homeScore: 0,
    awayScore: 1,
    competition: 'Friendly',
    status: 'finished',
    matchDate: '2026-05-31T19:30:00.000Z'
  },
  {
    id: 'm7',
    homeTeam: 'Real Madrid',
    awayTeam: 'FC Barcelona',
    homeScore: 2,
    awayScore: 1,
    competition: 'La Liga',
    status: 'finished',
    matchDate: '2026-05-28T18:00:00.000Z'
  },
  {
    id: 'm8',
    homeTeam: 'Manchester City',
    awayTeam: 'Bayern Munich',
    homeScore: 3,
    awayScore: 2,
    competition: 'Champions League',
    status: 'finished',
    matchDate: '2026-05-26T19:30:00.000Z'
  },
  {
    id: 'm9',
    homeTeam: 'Real Madrid',
    awayTeam: 'Manchester City',
    homeScore: null,
    awayScore: null,
    competition: 'Friendly',
    status: 'scheduled',
    matchDate: '2026-06-21T19:00:00.000Z'
  },
  {
    id: 'm10',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Bayern Munich',
    homeScore: null,
    awayScore: null,
    competition: 'Friendly',
    status: 'scheduled',
    matchDate: '2026-06-24T19:00:00.000Z'
  }
];

export const mockStats = {
  overview: {
    matchesPlayed: 12,
    goalsScored: 27,
    cleanSheets: 4,
    winRate: 66
  },
  standings: [
    { team: 'Real Madrid', played: 12, points: 31 },
    { team: 'FC Barcelona', played: 12, points: 29 },
    { team: 'Manchester City', played: 12, points: 28 },
    { team: 'Bayern Munich', played: 12, points: 24 }
  ]
};

export const mockExpertPredictions = [
  {
    matchId: 'm3',
    analyst: 'A. Petrov',
    pick: 'Real Madrid',
    confidence: 71,
    note: 'Better form and stronger defensive record suggest a narrow away win.'
  }
];
