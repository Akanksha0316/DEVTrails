const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ================= CONFIGURATION =================
const DB_PATH = path.join(__dirname, "db.json");
const LOG_PATH = path.join(__dirname, "backend.log");
const SECRET = "secret123";
let useMongoDB = false;

const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_PATH, line);
  console.log(msg);
};

// Clear old log
fs.writeFileSync(LOG_PATH, "--- Server Starting ---\n");

// Initialize JSON DB if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], policies: [], claims: [], weather: { status: "Clear", risk: 1.0 } }));
}

// 🔗 MongoDB Connection Attempt (Non-blocking)
mongoose.connect("mongodb://127.0.0.1:27017/insuranceDB", { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    log("✅ Connected to MongoDB");
    useMongoDB = true;
  })
  .catch((err) => {
    log("⚠️ MongoDB not found or timed out. Using local JSON database (db.json).");
    useMongoDB = false;
  });

// ================= HELPERS =================
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// ================= MODELS =================
const UserSchema = new mongoose.Schema({ name: String, location: String, workType: String, password: String });
const PolicySchema = new mongoose.Schema({ userId: String, workType: String, premium: Number, coverage: Number, status: String, createdAt: { type: Date, default: Date.now } });
const ClaimSchema = new mongoose.Schema({ userId: String, policyId: String, payout: Number, reason: String, status: String, createdAt: { type: Date, default: Date.now } });

const User = mongoose.model("User", UserSchema);
const Policy = mongoose.model("Policy", PolicySchema);
const Claim = mongoose.model("Claim", ClaimSchema);

// ================= AUTH MIDDLEWARE =================
function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send({ error: "Access denied. No token provided." });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ error: "Invalid token." });
  }
}

// ================= ROUTES =================

app.get("/api/health", (req, res) => res.send({ status: "OK", database: useMongoDB ? "MongoDB" : "JSON" }));

app.post("/api/register", async (req, res) => {
  const { name, location, workType, password } = req.body;
  log(`Register attempt: ${name}`);
  let user;
  if (useMongoDB) {
    try {
      user = new User({ name, location, workType, password });
      await user.save();
    } catch (e) { return res.status(500).send({ error: e.message }); }
  } else {
    const db = readDB();
    if (db.users.find(u => u.name === name)) return res.status(400).send({ error: "User already exists" });
    user = { id: Date.now().toString(), name, location, workType, password };
    db.users.push(user);
    writeDB(db);
  }
  
  const token = jwt.sign({ id: user._id || user.id, name: user.name, workType: user.workType, location: user.location }, SECRET);
  res.send({ message: "Identity Protocol Initialized", token, user: { name: user.name, workType: user.workType, location: user.location } });
});

app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;
  log(`Login attempt: ${name}`);
  let user;
  if (useMongoDB) { user = await User.findOne({ name, password }); } 
  else { user = readDB().users.find(u => u.name === name && u.password === password); if (user) user._id = user.id; }

  if (!user) return res.status(400).send({ error: "Invalid username or password" });
  const token = jwt.sign({ id: user._id, name: user.name, workType: user.workType, location: user.location }, SECRET);
  res.send({ token, user: { name: user.name, workType: user.workType, location: user.location } });
});

app.get("/api/weather-impact", (req, res) => {
  const db = readDB();
  res.send(db.weather || { status: "Clear", risk: 1.0 });
});

app.get("/api/public-stats", (req, res) => {
  const db = readDB();
  const claims = db.claims || [];
  const protectedNodes = db.users.length * 12 + 42; // Simulated scaling
  const totalPayout = claims.reduce((s, c) => s + c.payout, 0);
  res.send({ 
    totalProtected: protectedNodes, 
    totalSettled: totalPayout,
    activeTriggers: claims.length 
  });
});

app.get("/api/ledger-public", (req, res) => {
  const db = readDB();
  const claims = (db.claims || []).slice(-10).map(c => ({
    id: c.id,
    node: `NODE-${Math.floor(Math.random()*9000)+1000}`,
    amount: c.payout,
    reason: c.reason,
    time: c.createdAt
  }));
  res.send(claims);
});

app.post("/api/premium-preview", (req, res) => {
  const { workType, location } = req.body;
  const db = readDB();
  const envStatus = db.weather || { status: "Clear", risk: 1.0 };
  
  // Advanced 'AI' Premium Calculation Logic
  let basePremium = 140;
  if (['Swiggy', 'Zomato'].includes(workType)) basePremium = 120;
  if (['Amazon', 'Blinkit', 'Zepto'].includes(workType)) basePremium = 175;
  if (workType === 'Freelance') basePremium = 200;

  // Location Risk Factor
  let locRisk = 1.0;
  if (location === 'medium') locRisk = 1.25;
  if (location === 'high') locRisk = 1.6;

  // Environmental Risk Hub (Summing factors for 'AI' complexity)
  const finalRisk = (envStatus.risk * locRisk).toFixed(2);
  const premium = Math.round(basePremium * finalRisk);
  
  res.send({ 
    status: envStatus.status, 
    risk: finalRisk, 
    premium, 
    formula: `Base(${basePremium}) * Env(${envStatus.risk}) * Loc(${locRisk})` 
  });
});

app.post("/api/policy", auth, async (req, res) => {
  const { tier = "Elite" } = req.body;
  const { workType, location } = req.user;
  log(`Policy purchase (${tier}): ${req.user.name}`);
  
  const db = readDB();
  const risk = db.weather?.risk || 1.0;
  let basePremium = 150;
  let coverage = 5000;
  
  if (tier === 'Basic') { basePremium = 100; coverage = 3000; }
  if (tier === 'Elite') { basePremium = 150; coverage = 5000; }
  if (tier === 'Enterprise') { basePremium = 250; coverage = 10000; }

  if (workType === 'Swiggy' || workType === 'Zomato') basePremium -= 30;
  if (location === 'high') basePremium += 50;
  const premium = Math.round(basePremium * risk);

  const newPolicy = {
    id: "POL-" + Date.now().toString().slice(-6),
    userId: req.user.id,
    workType,
    tier,
    premium,
    coverage,
    status: "Active",
    createdAt: new Date()
  };

  if (useMongoDB) {
    const policy = new Policy(newPolicy);
    await policy.save();
  } else {
    db.policies.push(newPolicy);
    writeDB(db);
  }

  res.send({ message: `${tier} Policy Activated`, policy: newPolicy });
});

app.get("/api/stats", auth, async (req, res) => {
  log(`Stats request for ${req.user.name}`);
  let policies, claims;
  if (useMongoDB) {
    policies = await Policy.find({ userId: req.user.id });
    claims = await Claim.find({ userId: req.user.id });
  } else {
    const db = readDB();
    policies = db.policies.filter(p => p.userId === req.user.id);
    claims = db.claims.filter(c => c.userId === req.user.id);
  }
  const totalPayouts = claims.reduce((sum, c) => sum + c.payout, 0);
  res.send({ activePolicies: policies.length, totalPayouts, claimCount: claims.length });
});

app.post("/api/simulate-weather", async (req, res) => {
  const { status } = req.body;
  log(`Neural Simulation Triggered: ${status}`);
  let db = readDB();
  
  let risk = 1.0;
  let payout = 0;
  let reason = "";

  switch (status) {
    case "Rainy": risk = 1.4; payout = 450; reason = "Precipitation Threshold Exceeded"; break;
    case "Storm": risk = 2.1; payout = 950; reason = "Critical Storm Protocol: Operations Suspended"; break;
    case "Heatwave": risk = 1.8; payout = 600; reason = "Thermal Alert: External Deployment Risky"; break;
    case "Outage": risk = 2.5; payout = 1200; reason = "System-Wide Network Failure: Data Outage"; break;
    case "Pollution": risk = 1.3; payout = 300; reason = "AQI > 400: Hazardous Atmosphere Warning"; break;
    case "Clear": risk = 1.0; break;
  }

  db.weather = { status, risk };
  
  const affectedPolicies = db.policies.filter(p => p.status === "Active");
  if (payout > 0) {
    const newClaims = affectedPolicies.map(p => ({
      id: "CLAIM-" + Date.now().toString().slice(-6) + Math.floor(Math.random()*1000),
      userId: p.userId,
      policyId: p.id || p._id,
      payout: payout,
      reason: `Automated Parametric Trigger: ${reason}`,
      status: "Approved",
      createdAt: new Date()
    }));
    
    if (useMongoDB) { 
      await Claim.insertMany(newClaims); 
    } else { 
      db.claims.push(...newClaims); 
    }
  }
  
  writeDB(db);
  res.send({ message: `Neural Network updated to ${status}. Auto-claims triggered for ${affectedPolicies.length} nodes.` });
});

app.get("/api/policies", auth, async (req, res) => {
  if (useMongoDB) { res.send(await Policy.find({ userId: req.user.id })); }
  else { res.send(readDB().policies.filter(p => p.userId === req.user.id)); }
});

app.get("/api/claims", auth, async (req, res) => {
  if (useMongoDB) { res.send(await Claim.find({ userId: req.user.id })); }
  else { res.send(readDB().claims.filter(c => c.userId === req.user.id)); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    log(`🚀 WORKERGUARD SYSTEM ACTIVE ON PORT ${PORT}`);
}).on('error', (err) => {
    log(`❌ CRITICAL FAILURE: ${err.message}`);
});
