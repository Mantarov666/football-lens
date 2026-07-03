# Football Stats Analysis App

Уеб приложение за анализ и визуализация на статистика от футболни мачове.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL
- Auth: JWT

## Features

- Login / Register
- Favorite team selection
- Football stats dashboard
- Match details and team insights
- API adapter layer for football data provider
- Ready for later ML extension

## Project structure

- `client/` React app
- `server/` API server
- `database/schema.sql` MySQL schema

## Local setup

1. Copy `.env.example` to `.env`
2. Create the database from `database/schema.sql`
3. Install dependencies with `npm install`
4. Start both apps with `npm run dev`

The app expects:

- backend on `http://localhost:4000`
- frontend on `http://localhost:5173`

## Notes

- If no real football API key is configured, the backend returns mock data so the app remains usable.
- The first version focuses on a solid dashboard and clean foundations for future features.
