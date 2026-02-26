#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "Seeding DB..."
(cd backend && npm run db:seed 2>/dev/null) || true

echo "Starting backend (port 3001)..."
(cd backend && npm run dev) &
BACKEND_PID=$!

echo "Starting frontend (port 5173)..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
