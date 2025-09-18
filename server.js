import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.resolve("./db.json");

function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch (e) {
    return { users: [], accounts: {} };
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Register
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Missing fields" });

  const db = loadDB();
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  db.users.push({ username, password });
  db.accounts[username] = { balance: 500, transactions: [] };
  saveDB(db);
  res.json({ message: "User registered successfully" });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const db = loadDB();
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful", user: { username } });
});

// Get Accounts
app.get("/accounts/:username", (req, res) => {
  const db = loadDB();
  res.json(db.accounts[req.params.username] || { balance: 0, transactions: [] });
});

// Transfer
app.post("/transfer", (req, res) => {
  const { from, to, amount } = req.body;
  const db = loadDB();

  if (!from || !to || typeof amount === "undefined") {
    return res.status(400).json({ message: "Missing fields" });
  }

  const amt = Number(amount);
  if (Number.isNaN(amt) || amt <= 0) return res.status(400).json({ message: "Invalid amount" });

  if (!db.accounts[from] || db.accounts[from].balance < amt) {
    return res.status(400).json({ message: "Insufficient funds" });
  }

  db.accounts[from].balance -= amt;
  db.accounts[to] = db.accounts[to] || { balance: 0, transactions: [] };
  db.accounts[to].balance += amt;

  const now = new Date().toISOString();
  db.accounts[from].transactions.unshift({ type: "debit", to, amount: amt, date: now });
  db.accounts[to].transactions.unshift({ type: "credit", from, amount: amt, date: now });

  saveDB(db);
  res.json({ message: "Transfer successful" });
});

// Health
app.get("/", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
