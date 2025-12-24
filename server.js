const express = require("express");
const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 3000;

/* ==================== ADMIN CREDENTIALS ==================== */
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";

/* ==================== FALLBACK STORAGE ==================== */
const RSVPS_FILE = path.join(__dirname, "data", "rsvps.json");

/* ==================== FIREBASE INIT ==================== */
let db = null;
let storageType = "json";

try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  }

  db = admin.firestore();
  storageType = "firestore";
  console.log("🔥 Firebase Admin initialized — using Firestore");
} catch (err) {
  console.warn("⚠️ Firebase not configured — using JSON fallback");
  console.warn(err.message);
}

/* ==================== MIDDLEWARE ==================== */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ==================== STORAGE HELPERS ==================== */

async function saveRsvp(entry) {
  if (db) {
    const docRef = await db.collection("rsvps").add({
      ...entry,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id: docRef.id, ...entry };
  }

  const data = await fs.promises.readFile(RSVPS_FILE, "utf8").catch(() => "[]");
  const list = JSON.parse(data || "[]");
  list.push(entry);
  await fs.promises.writeFile(RSVPS_FILE, JSON.stringify(list, null, 2));
  return entry;
}

async function getRsvps() {
  if (db) {
    const snapshot = await db
      .collection("rsvps")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  const data = await fs.promises.readFile(RSVPS_FILE, "utf8").catch(() => "[]");
  return JSON.parse(data || "[]");
}

/* ==================== API ROUTES ==================== */

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    storage: storageType,
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/rsvp", async (req, res) => {
  try {
    const { name, guests, attend, message } = req.body;

    if (!name || !guests || !attend) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const entry = {
      name,
      guests: Number(guests),
      attend,
      message: message || "",
    };

    const saved = await saveRsvp(entry);

    res.json({
      success: true,
      message: "RSVP saved successfully",
      data: saved,
    });
  } catch (err) {
    console.error("❌ RSVP Save Error:", err);
    res.status(500).json({ error: "Failed to save RSVP" });
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({
    success: false,
    error: "Invalid credentials",
  });
});

app.get("/api/rsvps", async (req, res) => {
  try {
    const rsvps = await getRsvps();
    res.json({ success: true, data: rsvps });
  } catch (err) {
    console.error("❌ Fetch RSVPs Error:", err);
    res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
});

/* ==================== START SERVER ==================== */
app.listen(PORT, () => {
  console.log("\n🚀 InviteSphere Backend Running");
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📦 Storage: ${storageType.toUpperCase()}\n`);
});
