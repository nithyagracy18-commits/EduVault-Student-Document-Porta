import express from "express";
import { createServer as createViteServer } from "vite";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import fs from "fs";
import twilio from "twilio";
import Database from "better-sqlite3";
import crypto from "node:crypto";

// Twilio Config
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: any = null;
if (twilioSid && twilioAuthToken) {
  twilioClient = twilio(twilioSid, twilioAuthToken);
}

async function sendSMS(to: string, body: string) {
  const isDemoNumber = to.includes("7483099493") || to.includes("8951196547");
  
  console.log("-----------------------------------------");
  console.log(`[EDUVAULT SMS OUTBOX] To: ${to}`);
  console.log(`Message: ${body}`);
  if (isDemoNumber && !twilioClient) {
    console.log("🌟 [DEMO BYPASS] Authorized Test Number detected. Use the OTP above reaching your console.");
  }
  console.log("-----------------------------------------");

  if (twilioClient && twilioFrom) {
    try {
      const formattedTo = to.startsWith('+') ? to : `+91${to}`;
      await twilioClient.messages.create({
        body,
        from: twilioFrom,
        to: formattedTo
      });
      console.log(`[REAL SMS] Successfully dispatched via Twilio to ${formattedTo}`);
    } catch (err) {
      console.error("[TWILIO ERROR] Failed to send real SMS:", err);
    }
  }
}

// 1. SQLite Database Initialization
const dbPath = path.resolve(process.cwd(), "eduvault.db");
const db = new Database(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    upload_date TEXT,
    status TEXT DEFAULT 'pending',
    category TEXT DEFAULT 'other',
    description TEXT,
    folder_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS folders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    location TEXT DEFAULT 'vault',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log(`[SQLite] Database operational at: ${dbPath}`);

const app = express();
const PORT = 3000;

app.set('trust proxy', 1);

// OTP Storage (In-memory)
const tempOTPs: { [phone: string]: { otp: string, expires: number } } = {};

// Use cookie-session for persistence
app.use(cookieSession({
  name: 'eduvault-session',
  keys: ['eduvault-premium-secret-2026'],
  maxAge: 7 * 24 * 60 * 60 * 1000, 
  secure: true,
  sameSite: 'none',
  httpOnly: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Ensure uploads directory exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Auth Middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!(req.session as any)?.user) {
    return res.status(401).json({ error: "Unauthorized access. Please login." });
  }
  next();
};

// 1. Session Me
app.get("/api/me", (req, res) => {
  res.json({ 
    user: (req.session as any)?.user || null,
    dbStatus: 'operational_sqlite'
  });
});

// 2. OTP Endpoints
app.post("/api/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Contact details required." });
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  tempOTPs[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 };
  await sendSMS(phone, `EduVault Portal: Your OTP is ${otp}. Expires in 5m.`);
  res.json({ message: "OTP sent!", demo_otp: otp });
});

app.post("/api/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  const record = tempOTPs[phone];
  if (!record || Date.now() > record.expires || record.otp !== otp) {
    return res.status(400).json({ error: "Invalid or expired OTP." });
  }
  delete tempOTPs[phone];
  const user = { uid: phone, phone, email: `${phone}@student.portal`, name: 'Verified Student' };
  (req.session as any).user = user;
  res.json({ message: "OTP Verified!", user });
});

// 3. Document APIs (SQLite)
app.get("/api/documents", requireAuth, (req, res) => {
  const user = (req.session as any).user;
  try {
    const rows = db.prepare("SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC").all(user.uid);
    // Align SQLite snake_case/names to frontend expected format
    const docs = rows.map((r: any) => ({
      id: r.id.toString(), // Convert integer ID to string for frontend
      userId: r.user_id,
      name: r.file_name,
      fileData: r.file_path,
      type: r.file_type,
      uploadDate: r.upload_date,
      status: r.status,
      category: r.category,
      description: r.description,
      folderId: r.folder_id
    }));
    res.json(docs);
  } catch (e: any) { 
    res.status(500).json({ error: e.message }); 
  }
});

app.post("/api/documents", requireAuth, (req, res) => {
  const user = (req.session as any).user;
  try {
    const { fileData, name, type, uploadDate, status, category, description, folderId } = req.body;
    let filePath = fileData;
    
    // Save to disk
    if (fileData && fileData.startsWith('data:')) {
      const base64Content = fileData.split(',')[1];
      const buffer = Buffer.from(base64Content, 'base64');
      const filename = `${Date.now()}_${name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      filePath = `/uploads/${filename}`;
      fs.writeFileSync(path.join(uploadsDir, filename), buffer);
    }

    const stmt = db.prepare(`
      INSERT INTO documents (user_id, file_name, file_path, file_type, upload_date, status, category, description, folder_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(user.uid, name, filePath, type, uploadDate, status || 'pending', category || 'other', description, folderId);
    const docId = info.lastInsertRowid.toString();
    
    res.json({ id: docId, fileURL: filePath });
  } catch (e: any) { 
    console.error("Storage Error:", e);
    res.status(500).json({ error: e.message }); 
  }
});

app.patch("/api/documents/:id", requireAuth, (req, res) => {
  const user = (req.session as any).user;
  const updates = req.body;
  try {
    const fields = Object.keys(updates);
    if (fields.length === 0) return res.json({ success: true });

    // Map frontend camelCase to SQLite snake_case
    const mapField = (f: string) => {
      if (f === 'folderId') return 'folder_id';
      if (f === 'name') return 'file_name';
      if (f === 'fileData') return 'file_path';
      return f;
    };

    const setClause = fields.map(f => `${mapField(f)} = ?`).join(", ");
    const values = fields.map(f => updates[f]);
    
    const stmt = db.prepare(`UPDATE documents SET ${setClause} WHERE id = ? AND user_id = ?`);
    stmt.run(...values, req.params.id, user.uid);
    
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/documents/:id", requireAuth, (req, res) => {
  const user = (req.session as any).user;
  try {
    const doc: any = db.prepare("SELECT file_path FROM documents WHERE id = ? AND user_id = ?").get(req.params.id, user.uid);
    if (doc) {
      if (doc.file_path.startsWith('/uploads/')) {
        const fullPath = path.join(uploadsDir, doc.file_path.split('/').pop()!);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
      db.prepare("DELETE FROM documents WHERE id = ? AND user_id = ?").run(req.params.id, user.uid);
    }
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// 4. Folder APIs (SQLite)
app.get("/api/folders", requireAuth, (req, res) => {
  const user = (req.session as any).user;
  try {
    const rows = db.prepare("SELECT * FROM folders WHERE user_id = ?").all(user.uid);
    res.json(rows);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/folders", requireAuth, (req, res) => {
  const user = (req.session as any).user;
  try {
    const { name, location, id } = req.body;
    const folderId = id || crypto.randomUUID();
    db.prepare("INSERT INTO folders (id, user_id, name, location) VALUES (?, ?, ?, ?)")
      .run(folderId, user.uid, name, location);
    res.json({ id: folderId });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/auth/logout", (req, res) => {
  req.session = null;
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`EduVault Backend running with SQLite on port ${PORT}`));
}
startServer();
