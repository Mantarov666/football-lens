import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, XAxis, YAxis, ScatterChart, Scatter, ZAxis, ReferenceLine } from 'recharts';
import { getAnalysis, getDashboard, getExpertPredictions, getMatches, getOverview, getPredictions, getTeams, login, register, updateFavoriteTeam } from './api';

const fallbackUser = () => {
  const raw = localStorage.getItem('football-user');
  return raw ? JSON.parse(raw) : null;
};

const teamPalette = {
  'FC Barcelona': ['#7dd3fc', '#60a5fa'],
  'Real Madrid': ['#fda4af', '#fb7185'],
  'Manchester City': ['#a7f3d0', '#34d399'],
  'Bayern Munich': ['#fde68a', '#f59e0b']
};

function TeamBadge({ name, crest }) {
  const initials = (name || '?')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  const colors = teamPalette[name] || ['#93c5fd', '#34d399'];

  if (crest) {
    return (
      <div className="team-badge team-badge-img">
        <img src={crest} alt={name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        <div className="team-badge-fallback" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`, display: 'none' }}>{initials}</div>
      </div>
    );
  }

  return (
    <div className="team-badge" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
      {initials}
    </div>
  );
}

function StatRing({ label, value, total, hint }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / total) * 100)));
  const dash = 226 - (226 * pct) / 100;

  return (
    <div className="stat-ring">
      <svg viewBox="0 0 100 100" className="ring-svg" aria-hidden="true">
        <circle className="ring-track" cx="50" cy="50" r="36" />
        <circle className="ring-value" cx="50" cy="50" r="36" style={{ strokeDashoffset: dash }} />
      </svg>
      <div className="ring-center">
        <strong>{pct}%</strong>
        <span>{label}</span>
      </div>
      <div className="muted ring-hint">{hint}</div>
    </div>
  );
}

function ProbabilityBar({ label, value, compact = false }) {
  return (
    <div className="prob-row">
      {!compact && (
        <div className="prob-head">
          <span>{label}</span>
          <strong>{value}%</strong>
        </div>
      )}
      <div className="prob-track">
        <div className="prob-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="hero-illustration" aria-hidden="true">
      <img src="/wc2026.svg" alt="FIFA World Cup 2026" className="wc-logo-img" />
    </div>
  );
}

function Shell({ user, onLogout, children }) {
  const firstName = user?.fullName?.split(' ')[0] || null;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">F</div>
          <div>
            <div className="brand-title">Football Lens</div>
            <div className="brand-subtitle">Stats & Visualization</div>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/analysis">Analysis</NavLink>
          <NavLink to="/matches">Matches</NavLink>
          <NavLink to="/predictions">Predictions</NavLink>
          {user && <NavLink to="/settings">Settings</NavLink>}
        </nav>
        <div className="sidebar-card">
          {user ? (
            <>
              <p className="sidebar-greeting">Hello, {firstName}!</p>
              <strong>{user.fullName}</strong>
              <span className="muted">{user.favoriteTeam || 'No favorite team yet'}</span>
              <button className="button button-ghost" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <p className="muted">Welcome, guest</p>
              <span className="muted">Login to unlock expert predictions and personalized stats.</span>
              <Link className="button button-primary" to="/login">Login / Register</Link>
            </>
          )}
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

function LoginPage({ onAuth }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', favoriteTeam: '' });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = tab === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register(form);
      onAuth(payload.user, payload.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-left">
        <Link to="/" className="auth-brand">
          <div className="brand-badge">F</div>
          <div>
            <div className="brand-title">Football Lens</div>
            <div className="brand-subtitle">Stats & Visualization</div>
          </div>
        </Link>
        <div className="auth-hero-text">
          <h2>Your personal football analytics hub</h2>
          <p className="muted">Track FIFA World Cup 2026 results, get match predictions and explore statistics - all in one place.</p>
          <ul className="auth-features">
            <li>Real-time FIFA World Cup 2026 data</li>
            <li>Stats-based match predictions</li>
            <li>Expert predictions (members only)</li>
            <li>Personalized favorite team tracking</li>
          </ul>
        </div>
        <HeroIllustration />
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError(''); }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setError(''); }}
            >
              Register
            </button>
          </div>

          <div className="auth-header">
            <h1>{tab === 'login' ? 'Welcome back' : 'Create account'}</h1>
            <p className="muted">
              {tab === 'login'
                ? 'Log in to unlock expert predictions and your personalized dashboard.'
                : 'Join to access full analytics, expert insights and save your favorite team.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {tab === 'register' && (
              <>
                <div className="field-group">
                  <label className="field-label">Full name</label>
                  <input
                    className="auth-input"
                    placeholder="e.g. Georgi Ivanov"
                    value={form.fullName}
                    onChange={set('fullName')}
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Favourite team</label>
                  <input
                    className="auth-input"
                    placeholder="e.g. Brazil"
                    value={form.favoriteTeam}
                    onChange={set('favoriteTeam')}
                  />
                </div>
              </>
            )}
            <div className="field-group">
              <label className="field-label">Email address</label>
              <input
                className="auth-input"
                placeholder="you@example.com"
                type="email"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>
            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                className="auth-input"
                placeholder={tab === 'register' ? 'At least 6 characters' : 'Your password'}
                type="password"
                value={form.password}
                onChange={set('password')}
                required
              />
            </div>
            {error && <div className="error auth-error">{error}</div>}
            <button className="button button-primary auth-submit" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch-hint">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button className="button-link" onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }}>
              {tab === 'login' ? 'Register here' : 'Login here'}
            </button>
          </p>

          <Link to="/" className="auth-back-link">Back to public site</Link>
        </div>
      </div>
    </div>
  );
}

function LockedPage({ title = 'This section' }) {
  return (
    <div className="page locked-page">
      <div className="locked-card card">
        <div className="lock-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="lock-svg">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1>{title} is locked</h1>
        <p className="lead">You need to be logged in to access predictions and expert insights.</p>
        <div className="locked-benefits">
          <div className="locked-benefit">Stats-based match predictions</div>
          <div className="locked-benefit">Expert analyst picks</div>
          <div className="locked-benefit">Win / draw / loss probabilities</div>
        </div>
        <div className="locked-actions">
          <Link className="button button-primary" to="/login">Login to unlock</Link>
          <Link className="button button-ghost" to="/">Back to home</Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, note }) {
  return (
    <div className="card metric-card">
      <div className="muted">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="muted">{note}</div>
    </div>
  );
}

function MiniMetric({ label, value, note }) {
  return (
    <div className="mini-metric">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
      <span className="muted">{note}</span>
    </div>
  );
}

function DashboardPage({ user }) {
  const [dashboard, setDashboard] = useState(null);
  const [teams, setTeams] = useState([]);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const teamParam = user?.favoriteTeam ? `?team=${encodeURIComponent(user.favoriteTeam)}` : '';
    getDashboard(teamParam).then(setDashboard);
    getTeams().then(setTeams);
    getOverview().then(setOverview);
  }, [user?.favoriteTeam]);

  const teamStrengths = useMemo(() => {
    const fts = dashboard?.favoriteTeamStats;
    if (!fts || fts.played === 0) return { attack: 74, defense: 61, consistency: 68 };
    const attack = Math.min(100, Math.round((fts.goalsFor / fts.played) * 20));
    const defense = Math.max(0, 100 - Math.round((fts.goalsAgainst / fts.played) * 20));
    const consistency = Math.round((fts.won / fts.played) * 100);
    return { attack, defense, consistency };
  }, [dashboard]);

  const formData = useMemo(() => {
    const points = dashboard?.standings?.slice(0, 4) || [];
    return points.map((item, index) => ({
      ...item,
      fill: ['#66e3c4', '#4cc9f0', '#ffd166', '#f77f00'][index]
    }));
  }, [dashboard]);

  return (
    <div className="page">
      <section className="hero card">
        <div className="hero-copy">
          <p className="eyebrow">Welcome back, {user?.fullName?.split(' ')[0] || 'Champion'}!</p>
          <h1>Your football dashboard</h1>
          <p className="lead">
            Analyze World Cup results, explore team standings and unlock expert predictions - all in one place.
          </p>
          <div className="hero-cta-row">
            <Link className="button button-hero-primary" to="/predictions">Open Predictions</Link>
            <Link className="button button-hero-ghost" to="/matches">See matches</Link>
          </div>
        </div>
        <div className="hero-side">
          <HeroIllustration />
          <div className="hero-stats">
            <div className="hero-stat-card">
              <span className="muted">Favorite team</span>
              <strong>{user?.favoriteTeam || 'Choose one in Settings'}</strong>
            </div>
            <div className="hero-stat-card">
              <span className="muted">Tracked teams</span>
              <strong>{teams.length || 0}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="grid metrics-grid">
        <MetricCard label="Matches played" value={overview?.matchesPlayed ?? dashboard?.overview?.matchesPlayed ?? 0} note="Across tracked competitions" />
        <MetricCard label="Goals scored" value={overview?.goalsScored ?? dashboard?.overview?.goalsScored ?? 0} note="Team and league totals" />
        <MetricCard label="Clean sheets" value={overview?.cleanSheets ?? dashboard?.overview?.cleanSheets ?? 0} note="Defensive consistency" />
        <MetricCard label="Win rate" value={`${overview?.winRate ?? dashboard?.overview?.winRate ?? 0}%`} note="Recent performance" />
      </section>

      <section className="grid insight-strip">
        <div className="card insight-card accent-card">
          <p className="eyebrow">Momentum</p>
          <h3>Home advantage is real</h3>
          <p className="muted">Teams with stronger goal difference tend to perform better in knockout rounds.</p>
        </div>
        <div className="card insight-card">
          <p className="eyebrow">Attack</p>
          <h3>Goals drive predictions</h3>
          <p className="muted">Teams scoring more goals per game show higher win probabilities in the model.</p>
        </div>
        <div className="card insight-card">
          <p className="eyebrow">Defense</p>
          <h3>Clean sheets matter</h3>
          <p className="muted">Teams with fewer goals conceded rank higher in the defensive efficiency chart.</p>
        </div>
      </section>

      <section className="grid dashboard-grid">
        <div className="card chart-card">
          <div className="card-head">
            <h2>Standings</h2>
            <span className="muted">Top teams</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={formData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="team" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="points" radius={[10, 10, 0, 0]}>
                {formData.map((entry) => (
                  <Cell key={entry.team} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="card-head">
            <h2>Recent form</h2>
            <span className="muted">Mock time series</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={[
              { day: 'Mon', value: 4 },
              { day: 'Tue', value: 6 },
              { day: 'Wed', value: 3 },
              { day: 'Thu', value: 7 },
              { day: 'Fri', value: 5 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#66e3c4" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid three-grid">
        <div className="card">
          <div className="card-head">
            <h2>Team radar</h2>
            <span className="muted">Quick snapshot</span>
          </div>
          <div className="ring-grid">
            <StatRing label="Attack" value={overview?.goalsScored ?? 27} total={40} hint="Based on scored goals" />
            <StatRing label="Defense" value={overview?.cleanSheets ?? 4} total={10} hint="Clean sheets ratio" />
            <StatRing label="Form" value={overview?.winRate ?? 66} total={100} hint="Recent win rate" />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Favorite team</h2>
            <span className="muted">Personalized</span>
          </div>
          <div className="featured-team">
            <TeamBadge name={user?.favoriteTeam || 'FC Barcelona'} />
            <div>
              <strong>{user?.favoriteTeam || 'FC Barcelona'}</strong>
              <p className="muted">Your selected team is used for personalization and future saved analytics.</p>
            </div>
          </div>
          <div className="bars-stack">
            <ProbabilityBar label="Attack strength" value={teamStrengths.attack} />
            <ProbabilityBar label="Defense strength" value={teamStrengths.defense} />
            <ProbabilityBar label="Consistency" value={teamStrengths.consistency} />
          </div>
        </div>

        <div className="card mini-promo">
          <div className="card-head">
            <h2>Prediction access</h2>
            <span className="muted">Private section</span>
          </div>
          <p className="lead">
            Logged users can open Expert Prediction, compare model-based probabilities and access detailed forecast analysis.
          </p>
          <Link className="button button-primary" to="/predictions">Open prediction page</Link>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Latest matches</h2>
          <Link to="/matches">View all</Link>
        </div>
        <div className="matches-list">
          {(dashboard?.recentMatches || []).map((match) => (
            <article className="match-row" key={match.id}>
              <div className="match-identity">
                <TeamBadge name={match.homeTeam} />
                <strong>{match.homeTeam}</strong> vs <strong>{match.awayTeam}</strong>
                <div className="muted">{match.competition}</div>
              </div>
              <div className="score">
                {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getMatches()
      .then(setMatches)
      .catch((err) => console.error('Matches load error:', err));
  }, []);

  const filtered = matches.filter((m) => filter === 'all' || m.status === filter);
  const finishedCount = matches.filter((m) => m.status === 'finished').length;
  const scheduledCount = matches.filter((m) => m.status === 'scheduled').length;

  function formatStage(stage) {
    if (!stage) return '';
    return stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  return (
    <div className="page">
      <section className="hero card compact-hero">
        <div>
          <p className="eyebrow">Match center</p>
          <h1>FIFA World Cup 2026</h1>
          <p className="lead">Live results and upcoming fixtures from the World Cup.</p>
        </div>
        <div className="matches-hero-stats">
          <div className="hero-stat-card">
            <span className="muted">Played</span>
            <strong>{finishedCount}</strong>
          </div>
          <div className="hero-stat-card">
            <span className="muted">Upcoming</span>
            <strong>{scheduledCount}</strong>
          </div>
          <div className="hero-stat-card">
            <span className="muted">Total</span>
            <strong>{matches.length}</strong>
          </div>
        </div>
      </section>

      <div className="card">
        <div className="card-head">
          <h2>Fixtures</h2>
          <div className="filter-tabs">
            {['all', 'finished', 'scheduled'].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'finished' ? 'Finished' : 'Upcoming'}
              </button>
            ))}
          </div>
        </div>

        <div className="matches-grid">
          {filtered.length === 0 && (
            <div className="muted" style={{ padding: '2rem', textAlign: 'center' }}>No matches found.</div>
          )}
          {filtered.map((match) => (
            <article className="match-card" key={match.id}>
              <div className="match-card-meta">
                <span className={`match-status-badge ${match.status}`}>
                  {match.status === 'finished' ? 'FT' : 'Upcoming'}
                </span>
                <span className="muted">{new Date(match.matchDate).toLocaleDateString('bg-BG', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                {match.group && <span className="match-group">{match.group.replace('GROUP_', 'Group ')}</span>}
              </div>

              <div className="match-card-body">
                <div className="match-team home">
                  <TeamBadge name={match.homeTeam} crest={match.homeCrest} />
                  <span className="team-name">{match.homeTeam}</span>
                </div>

                <div className="match-score-center">
                  {match.status === 'finished' ? (
                    <div className="score-box">
                      <span>{match.homeScore}</span>
                      <span className="score-sep">:</span>
                      <span>{match.awayScore}</span>
                    </div>
                  ) : (
                    <div className="score-box upcoming">
                      <span>{new Date(match.matchDate).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                  <div className="match-stage">{formatStage(match.stage)}</div>
                </div>

                <div className="match-team away">
                  <TeamBadge name={match.awayTeam} crest={match.awayCrest} />
                  <span className="team-name">{match.awayTeam}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalysisPage() {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    getAnalysis().then(setAnalysis);
  }, []);

  const attackData = useMemo(() => analysis?.topAttack || [], [analysis]);
  const defenseData = useMemo(() => analysis?.topDefense || [], [analysis]);
  const trendData = useMemo(() => analysis?.goalsTrend || [], [analysis]);
  const outcomeData = useMemo(() => analysis?.resultDistribution || [], [analysis]);

  const outcomeColors = ['#66e3c4', '#4cc9f0', '#f77f00'];

  return (
    <div className="page">
      <section className="hero card compact-hero">
        <div>
          <p className="eyebrow">Analysis</p>
          <h1>Match Statistics & Insights</h1>
          <p className="lead">
            Team performance rankings, goal trends and outcome analysis from FIFA World Cup 2026.
          </p>
        </div>
        <div className="matches-hero-stats">
          <div className="hero-stat-card">
            <span className="muted">Best attack</span>
            <strong>{analysis?.summary?.topAttackTeam || '-'}</strong>
          </div>
          <div className="hero-stat-card">
            <span className="muted">Best defense</span>
            <strong>{analysis?.summary?.topDefenseTeam || '-'}</strong>
          </div>
          <div className="hero-stat-card">
            <span className="muted">Avg goals</span>
            <strong>{analysis?.summary?.avgGoalsPerMatch ?? '-'}</strong>
          </div>
        </div>
      </section>

      <section className="grid metrics-grid">
        <MetricCard label="Matches analyzed" value={analysis?.summary?.matchesPlayed ?? 0} note="Only finished games are used" />
        <MetricCard label="Total goals" value={analysis?.summary?.totalGoals ?? 0} note="Sum of home and away scores" />
        <MetricCard label="Avg goals / match" value={analysis?.summary?.avgGoalsPerMatch ?? 0} note="Average across all finished matches" />
        <MetricCard label="Home wins" value={analysis?.summary?.homeWins ?? 0} note="Outcome distribution" />
      </section>

      <section className="grid three-grid">
        <div className="card chart-card">
          <div className="card-head">
            <h2>Top attack</h2>
            <span className="muted">Goals scored</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={attackData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis type="category" dataKey="team" stroke="#94a3b8" width={100} />
              <Tooltip />
              <Bar dataKey="goalsFor" radius={[0, 10, 10, 0]} fill="#66e3c4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="card-head">
            <h2>Best defense</h2>
            <span className="muted">Fewest goals conceded</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={defenseData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis type="category" dataKey="team" stroke="#94a3b8" width={100} />
              <Tooltip />
              <Bar dataKey="goalsAgainst" radius={[0, 10, 10, 0]} fill="#4cc9f0" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="card-head">
            <h2>Outcome split</h2>
            <span className="muted">Home / draw / away</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={outcomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={45} paddingAngle={4}>
                {outcomeData.map((entry, index) => (
                  <Cell key={entry.name} fill={outcomeColors[index % outcomeColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Team standings</h2>
          <span className="muted">Ranked by points</span>
        </div>
        <div className="standings-table-wrap">
          <table className="standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {[...(analysis?.teamStats || [])]
                .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff)
                .slice(0, 15)
                .map((team, i) => (
                  <tr key={team.team} className={i < 3 ? 'top-row' : ''}>
                    <td className="rank">{i + 1}</td>
                    <td className="team-col"><strong>{team.team}</strong></td>
                    <td>{team.matchesPlayed}</td>
                    <td>{team.wins}</td>
                    <td>{team.draws}</td>
                    <td>{team.losses}</td>
                    <td className="highlight">{team.goalsFor}</td>
                    <td>{team.goalsAgainst}</td>
                    <td className={team.goalDiff > 0 ? 'positive' : team.goalDiff < 0 ? 'negative' : ''}>{team.goalDiff > 0 ? '+' : ''}{team.goalDiff}</td>
                    <td className="pts">{team.points}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── New charts row ── */}
      <section className="grid two-grid">
        <div className="card chart-card">
          <div className="card-head">
            <h2>Goals For vs Against</h2>
            <span className="muted">Top 8 teams comparison</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={[...(analysis?.teamStats || [])].sort((a, b) => b.goalsFor - a.goalsFor).slice(0, 8)}
              margin={{ left: 0, right: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="team" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={52} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }} />
              <Legend />
              <Bar dataKey="goalsFor" name="Goals For" fill="#0d9e80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="goalsAgainst" name="Goals Against" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="card-head">
            <h2>Win Rate %</h2>
            <span className="muted">Top 8 teams by win percentage</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              layout="vertical"
              data={[...(analysis?.teamStats || [])]
                .filter(t => t.matchesPlayed > 0)
                .map(t => ({ ...t, winRate: Math.round((t.wins / t.matchesPlayed) * 100) }))
                .sort((a, b) => b.winRate - a.winRate)
                .slice(0, 8)}
              margin={{ left: 8, right: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} unit="%" />
              <YAxis type="category" dataKey="team" stroke="#94a3b8" tick={{ fontSize: 11 }} width={110} />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }} />
              <ReferenceLine x={50} stroke="#e2e8f0" strokeDasharray="4 4" />
              <Bar dataKey="winRate" name="Win Rate" radius={[0, 6, 6, 0]} fill="#0284c7">
                {[...(analysis?.teamStats || [])]
                  .filter(t => t.matchesPlayed > 0)
                  .map(t => ({ ...t, winRate: Math.round((t.wins / t.matchesPlayed) * 100) }))
                  .sort((a, b) => b.winRate - a.winRate)
                  .slice(0, 8)
                  .map((entry, i) => (
                    <Cell key={entry.team} fill={i < 3 ? '#0d9e80' : '#0284c7'} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid two-grid">
        <div className="card chart-card">
          <div className="card-head">
            <h2>Team radar - Top 5</h2>
            <span className="muted">Points, goals scored, goal difference</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart
              data={[...(analysis?.teamStats || [])].sort((a, b) => b.points - a.points).slice(0, 5).map(t => ({
                team: t.team.length > 12 ? t.team.slice(0, 12) + '.' : t.team,
                Points: t.points,
                Attack: t.goalsFor,
                Defense: Math.max(0, 10 - t.goalsAgainst),
                Wins: t.wins * 2,
              }))}
            >
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="team" tick={{ fontSize: 10, fill: '#64748b' }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <Radar name="Points" dataKey="Points" stroke="#0d9e80" fill="#0d9e80" fillOpacity={0.18} />
              <Radar name="Attack" dataKey="Attack" stroke="#0284c7" fill="#0284c7" fillOpacity={0.14} />
              <Legend />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <div className="card-head">
            <h2>Attack vs Efficiency</h2>
            <span className="muted">Goals scored vs points earned</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 12, right: 20, bottom: 12, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="goalsFor" name="Goals Scored" type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} label={{ value: 'Goals', position: 'insideBottom', offset: -4, fontSize: 11, fill: '#94a3b8' }} />
              <YAxis dataKey="points" name="Points" type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} label={{ value: 'Pts', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }} />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 12px', fontSize: 12 }}>
                      <strong>{d.team}</strong>
                      <div>Goals: {d.goalsFor} | Pts: {d.points}</div>
                    </div>
                  );
                }}
              />
              <Scatter
                data={(analysis?.teamStats || []).filter(t => t.matchesPlayed > 0)}
                fill="#0d9e80"
                fillOpacity={0.8}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid three-grid">
        <div className="card">
          <div className="card-head">
            <h2>Key insights</h2>
            <span className="muted">Automatic analysis</span>
          </div>
          <div className="insight-stack">
            {(analysis?.insights || []).map((item) => (
              <div className="insight-bullet" key={item}>{item}</div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Top teams</h2>
            <span className="muted">Attack vs defense</span>
          </div>
          <div className="team-analysis-list">
            {(analysis?.teamStats || []).slice(0, 4).map((team) => (
              <div className="team-analysis-row" key={team.team}>
                <TeamBadge name={team.team} />
                <div className="team-analysis-copy">
                  <strong>{team.team}</strong>
                  <span className="muted">GF {team.goalsFor} | GA {team.goalsAgainst} | GD {team.goalDiff}</span>
                </div>
                <div className="team-analysis-points">{team.points} pts</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Analysis summary</h2>
            <span className="muted">Quick read</span>
          </div>
          <div className="summary-box">
            <p><strong>Best attack:</strong> {analysis?.summary?.topAttackTeam || '-'}</p>
            <p><strong>Best defense:</strong> {analysis?.summary?.topDefenseTeam || '-'}</p>
            <p><strong>Most efficient:</strong> {analysis?.summary?.mostEfficientTeam || '-'}</p>
            <p><strong>Average goals:</strong> {analysis?.summary?.avgGoalsPerMatch ?? 0}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PredictionsPage({ user }) {
  const [predictions, setPredictions] = useState([]);
  const [expertPredictions, setExpertPredictions] = useState([]);

  useEffect(() => {
    getPredictions().then(setPredictions);

    if (user) {
      getExpertPredictions().then(setExpertPredictions);
    }
  }, [user]);

  return (
    <div className="page">
      <section className="hero card compact-hero">
        <div>
          <p className="eyebrow">Prediction lab</p>
          <h1>Stats-driven forecasts</h1>
          <p className="lead">
            A visually rich prediction section with public model output and a private expert layer for logged users.
          </p>
        </div>
        <div className="prediction-hero-card">
          <div className="muted">Live preview</div>
          <strong>Model + Expert</strong>
          <p>Compare machine-based probabilities with analyst suggestions.</p>
        </div>
      </section>

      <div className="card">
        <div className="card-head">
          <h2>Match prediction</h2>
          <span className="muted">Stats-based forecast for upcoming games</span>
        </div>
        <div className="prediction-list">
          {predictions.map((prediction) => {
            const expert = expertPredictions.find((item) => item.matchId === prediction.matchId);

            return (
              <article className="prediction-card" key={prediction.matchId}>
                <div className="prediction-top">
                  <div>
                    <strong>{prediction.matchLabel}</strong>
                    <div className="muted">{prediction.competition}</div>
                  </div>
                  <div className="prediction-score">{prediction.predictedScore}</div>
                </div>

                <div className="prediction-grid">
                  <div>
                    <span className="muted">Home win</span>
                    <strong>{prediction.probabilities.homeWin}%</strong>
                    <ProbabilityBar compact label="" value={prediction.probabilities.homeWin} />
                  </div>
                  <div>
                    <span className="muted">Draw</span>
                    <strong>{prediction.probabilities.draw}%</strong>
                    <ProbabilityBar compact label="" value={prediction.probabilities.draw} />
                  </div>
                  <div>
                    <span className="muted">Away win</span>
                    <strong>{prediction.probabilities.awayWin}%</strong>
                    <ProbabilityBar compact label="" value={prediction.probabilities.awayWin} />
                  </div>
                  <div>
                    <span className="muted">Predicted winner</span>
                    <strong>{prediction.winner}</strong>
                    <div className="winner-tag">Model pick</div>
                  </div>
                </div>

                <ul className="prediction-notes">
                  {prediction.explanation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="expert-panel">
                  <div className="card-head">
                    <h3>Expert Prediction</h3>
                    {user ? <span className="muted">Available for logged users</span> : <span className="muted">Login required</span>}
                  </div>
                  {user && expert?.expertPrediction ? (
                    <div className="expert-content">
                      <strong>{expert.expertPrediction.pick}</strong>
                      <div className="muted">Analyst: {expert.expertPrediction.analyst}</div>
                      <div className="muted">Confidence: {expert.expertPrediction.confidence}%</div>
                      <p>{expert.expertPrediction.note}</p>
                    </div>
                  ) : (
                    <div className="locked-box">
                      <p>Log in to see the expert prediction and compare it with the model forecast.</p>
                      {!user && <Link className="button button-primary" to="/login">Login</Link>}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ user, onUserChange }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(user?.favoriteTeam || 'FC Barcelona');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getTeams().then(data => setTeams([...data].sort((a, b) => a.name.localeCompare(b.name))));
  }, []);

  const saveTeam = async () => {
    setError('');
    setSaved(false);

    try {
      const nextUser = await updateFavoriteTeam(selectedTeam);
      onUserChange(nextUser);
      setSaved(true);
      localStorage.setItem('football-user', JSON.stringify(nextUser));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <section className="hero card compact-hero">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>Customize your football identity</h1>
          <p className="lead">
            Keep the app personal by selecting your favorite club and tailoring your dashboard experience.
          </p>
        </div>
        <div className="prediction-hero-card">
          <div className="muted">Account</div>
          <strong>{user?.fullName}</strong>
          <p>{user?.email}</p>
        </div>
      </section>

      <div className="card settings-card">
        <div className="card-head">
          <h2>Profile settings</h2>
          <span className="muted">Update your favorite team</span>
        </div>
        <label className="field">
          Favorite team
          <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
            {teams.map((team) => (
              <option key={team.id} value={team.name}>{team.name}</option>
            ))}
          </select>
        </label>
        <button className="button button-primary" onClick={saveTeam}>Save favorite team</button>
        {error && <p className="error">{error}</p>}
        {saved && <p className="success">Favorite team saved successfully.</p>}
      </div>
    </div>
  );
}

function PublicHomePage({ user }) {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    getDashboard().then(setDashboard);
  }, []);

  return (
    <div className="page">
      <section className="hero card">
        <div className="hero-copy">
          <p className="eyebrow">Live Tournament Tracker</p>
          <h1>FIFA World Cup 2026</h1>
          <p className="lead">
            Follow every match, explore team statistics, track standings and unlock expert predictions — all in real time.
          </p>
          <div className="hero-cta-row">
            <Link className="button button-hero-primary" to="/login">Get started</Link>
            <Link className="button button-hero-ghost" to="/matches">See matches</Link>
          </div>
        </div>
        <div className="hero-side">
          <HeroIllustration />
        </div>
      </section>

      <section className="grid three-grid">
        <div className="card info-card">
          <p className="eyebrow">Live data</p>
          <h3>FIFA World Cup 2026</h3>
          <p className="muted">Real-time results, standings and statistics from the biggest football tournament in the world.</p>
        </div>
        <div className="card info-card accent-card">
          <p className="eyebrow">Analysis</p>
          <h3>Statistics & Insights</h3>
          <p className="muted">Attack rankings, defensive records, goal trends and outcome distribution across all group stage matches.</p>
        </div>
        <div className="card info-card">
          <p className="eyebrow">Predictions</p>
          <h3>Match Forecasts</h3>
          <p className="muted">Statistical model predictions for upcoming fixtures based on team form and tournament performance.</p>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>What the app analyzes</h2>
          <Link to="/analysis">Open analysis page</Link>
        </div>
        <div className="analysis-preview-grid">
          <MiniMetric label="Score trends" value="Goals per match" note="How offensive the games are" />
          <MiniMetric label="Team strength" value="Attack vs defense" note="Comparative balance" />
          <MiniMetric label="Results" value="Home / Draw / Away" note="Outcome distribution" />
          <MiniMetric label="Prediction" value="Match winner" note="Model-based forecast" />
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Latest matches</h2>
          <Link to="/matches">Browse all</Link>
        </div>
        <div className="matches-list">
          {(dashboard?.recentMatches || []).map((match) => (
            <article className="match-row" key={match.id}>
              <div>
                <strong>{match.homeTeam}</strong> vs <strong>{match.awayTeam}</strong>
                <div className="muted">{match.competition}</div>
              </div>
              <div className="score">
                {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(fallbackUser());

  useEffect(() => {
    if (user) localStorage.setItem('football-user', JSON.stringify(user));
  }, [user]);

  const handleAuth = (nextUser, token) => {
    localStorage.setItem('football-token', token);
    setUser(nextUser);
    localStorage.setItem('football-user', JSON.stringify(nextUser));
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('football-token');
    localStorage.removeItem('football-user');
    setUser(null);
    navigate('/');
  };

  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onAuth={handleAuth} />} />
      </Routes>
    );
  }

  return (
    <Shell user={user} onLogout={handleLogout}>
      <Routes location={location}>
        <Route path="/" element={user ? <DashboardPage user={user} /> : <PublicHomePage user={user} />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/predictions" element={user ? <PredictionsPage user={user} /> : <LockedPage title="Predictions" />} />
        <Route path="/settings" element={user ? <SettingsPage user={user} onUserChange={setUser} /> : <Navigate to="/login" />} />
      </Routes>
    </Shell>
  );
}
