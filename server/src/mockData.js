export const mockTeams = [
  { id: 1, name: 'Argentina', country: 'Argentina' },
  { id: 2, name: 'France', country: 'France' },
  { id: 3, name: 'Brazil', country: 'Brazil' },
  { id: 4, name: 'England', country: 'England' },
  { id: 5, name: 'Germany', country: 'Germany' },
  { id: 6, name: 'Spain', country: 'Spain' },
  { id: 7, name: 'Portugal', country: 'Portugal' },
  { id: 8, name: 'Colombia', country: 'Colombia' },
  { id: 9, name: 'Morocco', country: 'Morocco' },
  { id: 10, name: 'Switzerland', country: 'Switzerland' },
  { id: 11, name: 'Mexico', country: 'Mexico' },
  { id: 12, name: 'Egypt', country: 'Egypt' }
];

export const mockMatches = [
  {
    id: 'm1',
    homeTeam: 'France',
    awayTeam: 'Mexico',
    homeScore: 2,
    awayScore: 0,
    competition: 'FIFA World Cup',
    status: 'finished',
    matchDate: '2026-06-12T18:00:00.000Z'
  },
  {
    id: 'm2',
    homeTeam: 'Argentina',
    awayTeam: 'Morocco',
    homeScore: 3,
    awayScore: 1,
    competition: 'FIFA World Cup',
    status: 'finished',
    matchDate: '2026-06-13T19:00:00.000Z'
  },
  {
    id: 'm3',
    homeTeam: 'England',
    awayTeam: 'Norway',
    homeScore: 2,
    awayScore: 1,
    competition: 'FIFA World Cup',
    status: 'finished',
    matchDate: '2026-06-14T18:00:00.000Z'
  },
  {
    id: 'm4',
    homeTeam: 'Brazil',
    awayTeam: 'South Africa',
    homeScore: 2,
    awayScore: 0,
    competition: 'FIFA World Cup',
    status: 'finished',
    matchDate: '2026-06-15T20:00:00.000Z'
  },
  {
    id: 'm5',
    homeTeam: 'Germany',
    awayTeam: 'United States',
    homeScore: 1,
    awayScore: 0,
    competition: 'FIFA World Cup',
    status: 'finished',
    matchDate: '2026-06-16T18:00:00.000Z'
  },
  {
    id: 'm6',
    homeTeam: 'Spain',
    awayTeam: 'Morocco',
    homeScore: 1,
    awayScore: 0,
    competition: 'FIFA World Cup',
    status: 'finished',
    matchDate: '2026-06-17T19:00:00.000Z'
  },
  {
    id: 'm7',
    homeTeam: 'Portugal',
    awayTeam: 'Switzerland',
    homeScore: 2,
    awayScore: 1,
    competition: 'FIFA World Cup',
    status: 'finished',
    matchDate: '2026-06-18T18:00:00.000Z'
  },
  {
    id: 'm8',
    homeTeam: 'Colombia',
    awayTeam: 'Egypt',
    homeScore: 2,
    awayScore: 0,
    competition: 'FIFA World Cup',
    status: 'finished',
    matchDate: '2026-06-19T20:00:00.000Z'
  },
  {
    id: 'm9',
    homeTeam: 'Argentina',
    awayTeam: 'Egypt',
    homeScore: null,
    awayScore: null,
    competition: 'FIFA World Cup',
    status: 'scheduled',
    matchDate: '2026-07-08T19:00:00.000Z'
  },
  {
    id: 'm10',
    homeTeam: 'Colombia',
    awayTeam: 'Switzerland',
    homeScore: null,
    awayScore: null,
    competition: 'FIFA World Cup',
    status: 'scheduled',
    matchDate: '2026-07-09T19:00:00.000Z'
  }
];

export const mockStats = [
  { teamName: 'France',      played: 4, won: 4, drawn: 0, lost: 0, goalsFor: 10, goalsAgainst: 2, points: 12 },
  { teamName: 'Argentina',   played: 4, won: 3, drawn: 1, lost: 0, goalsFor: 9,  goalsAgainst: 3, points: 10 },
  { teamName: 'Brazil',      played: 4, won: 3, drawn: 0, lost: 1, goalsFor: 8,  goalsAgainst: 4, points: 9  },
  { teamName: 'England',     played: 4, won: 3, drawn: 0, lost: 1, goalsFor: 7,  goalsAgainst: 3, points: 9  },
  { teamName: 'Germany',     played: 4, won: 3, drawn: 0, lost: 1, goalsFor: 9,  goalsAgainst: 4, points: 9  },
  { teamName: 'Spain',       played: 4, won: 2, drawn: 2, lost: 0, goalsFor: 6,  goalsAgainst: 2, points: 8  },
  { teamName: 'Portugal',    played: 4, won: 2, drawn: 2, lost: 0, goalsFor: 7,  goalsAgainst: 3, points: 8  },
  { teamName: 'Colombia',    played: 4, won: 2, drawn: 1, lost: 1, goalsFor: 6,  goalsAgainst: 3, points: 7  },
  { teamName: 'Morocco',     played: 4, won: 2, drawn: 0, lost: 2, goalsFor: 4,  goalsAgainst: 5, points: 6  },
  { teamName: 'Switzerland', played: 4, won: 1, drawn: 1, lost: 2, goalsFor: 4,  goalsAgainst: 6, points: 4  },
  { teamName: 'Mexico',      played: 4, won: 1, drawn: 0, lost: 3, goalsFor: 3,  goalsAgainst: 8, points: 3  },
  { teamName: 'Egypt',       played: 4, won: 0, drawn: 1, lost: 3, goalsFor: 2,  goalsAgainst: 9, points: 1  }
];

export const mockExpertPredictions = [
  {
    homeTeam: 'Argentina',
    awayTeam: 'Egypt',
    analyst: 'St. Mantarov',
    pick: 'Argentina',
    confidence: 80,
    note: 'Argentina rely on an organized style with Messi leading the attack. Egypt have not faced a serious opponent so far and will struggle against this level. Despite Salah\'s quality, I expect Egypt to fail to score. Prediction: 2:0 with a Messi goal.'
  },
  {
    homeTeam: 'Colombia',
    awayTeam: 'Switzerland',
    analyst: 'St. Mantarov',
    pick: 'Draw',
    confidence: 62,
    note: 'Colombia play an attacking style with Luis Diaz in excellent form this season. Switzerland are experienced and well-drilled — virtually the same squad for years. Manzambi is the revelation of the tournament. Expecting a fast, open match — 1:1 after 90 minutes with extra time to follow.'
  }
];
