const API_BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('football-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export function login(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function register(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getDashboard(query = '') {
  return request(`/dashboard${query}`);
}

export function getTeams() {
  return request('/teams');
}

export function getMatches() {
  return request('/matches');
}

export function getOverview() {
  return request('/stats/overview');
}

export function getStandings() {
  return request('/stats/standings');
}

export function updateFavoriteTeam(favoriteTeam) {
  return request('/me/favorite-team', {
    method: 'PUT',
    body: JSON.stringify({ favoriteTeam })
  });
}

export function getPredictions() {
  return request('/predictions');
}

export function getExpertPredictions() {
  return request('/predictions/expert');
}

export function getAnalysis() {
  return request('/analysis');
}
