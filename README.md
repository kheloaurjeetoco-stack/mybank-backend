# MyBank Backend

Simple Node.js + Express backend using a JSON file (`db.json`) as storage.  
**For demo/educational use only. Do not store real credentials.**

## Files
- `server.js` - Express server (register, login, accounts, transfer)
- `db.json` - Simple JSON storage with default demo user
- `package.json` - Dependencies and start script

## Run locally
1. Install Node.js (v18+ recommended)
2. Install deps: `npm install`
3. Start: `npm start`
4. Server runs at http://localhost:3000

## Deploy (Render / Railway)
- Push this repo to GitHub.
- Create a new web service on Render/Railway and connect the repo.
- Start command: `npm start`
- Ensure `PORT` is set by the platform (Render/Railway set it automatically).

## Notes
- This is a demo backend. For production, use a real database, hashing for passwords, authentication tokens, input validation, and rate limiting.
