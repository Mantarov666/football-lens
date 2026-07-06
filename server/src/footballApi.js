import { config } from "./config.js";
import { mockMatches, mockStats, mockTeams } from "./mockData.js";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = {};

function hasRealApiAccess() {
  return Boolean(config.footballApiBaseUrl && config.footballApiKey);
}

function apiHeaders() {
  return { "X-Auth-Token": config.footballApiKey };
}

async function cachedFetch(key, url) {
  const now = Date.now();
  if (cache[key] && now - cache[key].time < CACHE_TTL) {
    return cache[key].data;
  }
  const response = await fetch(url, { headers: apiHeaders() });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  const data = await response.json();
  cache[key] = { data, time: now };
  return data;
}

export async function getTeams() {
  if (!hasRealApiAccess()) return mockTeams;
  try {
    const data = await cachedFetch("teams", `${config.footballApiBaseUrl}/competitions/WC/teams`);
    return data.teams.map(t => ({
      id: String(t.id),
      name: t.name,
      shortName: t.shortName,
      country: t.area?.name || "",
      logoUrl: t.crest || ""
    }));
  } catch (e) {
    console.error("Teams API error, using mock:", e.message);
    return mockTeams;
  }
}

export async function getMatches() {
  if (!hasRealApiAccess()) return mockMatches;
  try {
    const data = await cachedFetch("matches", `${config.footballApiBaseUrl}/competitions/WC/matches?limit=30`);
    return data.matches.map(m => ({
      id: String(m.id),
      homeTeam: m.homeTeam?.name || 'TBD',
      awayTeam: m.awayTeam?.name || 'TBD',
      homeCrest: m.homeTeam?.crest || null,
      awayCrest: m.awayTeam?.crest || null,
      homeScore: m.score?.fullTime?.home ?? null,
      awayScore: m.score?.fullTime?.away ?? null,
      competition: m.competition?.name || "FIFA World Cup",
      stage: m.stage || null,
      group: m.group || null,
      status: m.status === "FINISHED" ? "finished" : "scheduled",
      matchDate: m.utcDate
    }));
  } catch (e) {
    console.error("Matches API error, using mock:", e.message);
    return mockMatches;
  }
}

export async function getStats() {
  if (!hasRealApiAccess()) return mockStats;
  try {
    const data = await cachedFetch("stats", `${config.footballApiBaseUrl}/competitions/WC/standings`);
    const table = (data.standings || []).filter(s => s.type === 'TOTAL').flatMap(group => group.table || []);
    return table.map(row => ({
      teamId: String(row.team.id),
      teamName: row.team.name,
      played: row.playedGames,
      won: row.won,
      drawn: row.draw,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      points: row.points
    }));
  } catch (e) {
    console.error("Stats API error, using mock:", e.message);
    return mockStats;
  }
}
