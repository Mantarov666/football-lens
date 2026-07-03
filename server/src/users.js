import { getPool } from './db.js';
import { comparePassword, hashPassword } from './auth.js';

const memoryUsers = [];

function mapRow(row) {
  if (!row) return null;

  return {
    id: String(row.id),
    email: row.email,
    fullName: row.full_name ?? row.fullName,
    favoriteTeam: row.favorite_team ?? row.favoriteTeam ?? null,
    passwordHash: row.password_hash ?? row.passwordHash
  };
}

async function withDb(action, fallback) {
  try {
    const pool = getPool();
    return await action(pool);
  } catch (error) {
    return fallback(error);
  }
}

export async function createUser({ email, password, fullName, favoriteTeam = 'FC Barcelona' }) {
  const passwordHash = await hashPassword(password);

  return withDb(
    async (pool) => {
      const [result] = await pool.execute(
        'INSERT INTO users (email, password_hash, full_name, favorite_team) VALUES (?, ?, ?, ?)',
        [email, passwordHash, fullName, favoriteTeam]
      );

      return {
        id: String(result.insertId),
        email,
        fullName,
        favoriteTeam,
        passwordHash
      };
    },
    () => {
      const user = {
        id: String(Date.now()),
        email,
        fullName,
        favoriteTeam,
        passwordHash
      };
      memoryUsers.push(user);
      return user;
    }
  );
}

export async function findUserByEmail(email) {
  return withDb(
    async (pool) => {
      const [rows] = await pool.execute(
        'SELECT id, email, password_hash, full_name, favorite_team FROM users WHERE email = ? LIMIT 1',
        [email]
      );

      return mapRow(rows[0]);
    },
    () => mapRow(memoryUsers.find((user) => user.email === email))
  );
}

export async function findUserById(id) {
  return withDb(
    async (pool) => {
      const [rows] = await pool.execute(
        'SELECT id, email, password_hash, full_name, favorite_team FROM users WHERE id = ? LIMIT 1',
        [id]
      );

      return mapRow(rows[0]);
    },
    () => mapRow(memoryUsers.find((user) => String(user.id) === String(id)))
  );
}

export async function updateFavoriteTeam(id, favoriteTeam) {
  return withDb(
    async (pool) => {
      await pool.execute('UPDATE users SET favorite_team = ? WHERE id = ?', [favoriteTeam, id]);
      return findUserById(id);
    },
    () => {
      const user = memoryUsers.find((item) => String(item.id) === String(id));
      if (user) {
        user.favoriteTeam = favoriteTeam;
      }
      return mapRow(user);
    }
  );
}

export async function validatePassword(user, password) {
  return comparePassword(password, user.passwordHash);
}

