const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_EMAIL = "at517432@gmail.com";

// ── Database ─────────────────────────────────────────────────────────────────

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")
      ? { rejectUnauthorized: false }
      : false,
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL,
      email      TEXT NOT NULL,
      board_class TEXT NOT NULL,
      subject    TEXT NOT NULL,
      location   TEXT NOT NULL,
      message    TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  console.log("Database ready");
}

function rowToEnquiry(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    boardClass: row.board_class,
    subject: row.subject,
    location: row.location,
    message: row.message,
    createdAt: row.created_at,
  };
}

// ── Email ─────────────────────────────────────────────────────────────────────

async function sendEmails(row) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);

  const formattedDate = new Date(row.created_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const adminText = [
    "New enquiry received!",
    "",
    `Name: ${row.name}`,
    `Phone: ${row.phone}`,
    `Email: ${row.email}`,
    `Board & Class: ${row.board_class}`,
    `Subject: ${row.subject}`,
    `Location: ${row.location}`,
    `Message: ${row.message || "No message"}`,
    `Date: ${formattedDate}`,
  ].join("\n");

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#fff8f0;border:1px solid #fed7aa;border-radius:8px;">
      <div style="background:#f97316;padding:16px 20px;border-radius:6px 6px 0 0;margin:-20px -20px 20px;">
        <h2 style="color:white;margin:0;font-size:18px;">New Enquiry Received - MyClasses</h2>
      </div>
      <p style="color:#1c1917;font-size:15px;margin:0 0 20px;"><strong>New enquiry received!</strong></p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#92400e;font-weight:bold;width:130px;">Name</td><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#1c1917;">${row.name}</td></tr>
        <tr><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#92400e;font-weight:bold;">Phone</td><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#1c1917;">${row.phone}</td></tr>
        <tr><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#92400e;font-weight:bold;">Email</td><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#1c1917;">${row.email}</td></tr>
        <tr><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#92400e;font-weight:bold;">Board &amp; Class</td><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#1c1917;">${row.board_class}</td></tr>
        <tr><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#92400e;font-weight:bold;">Subject</td><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#1c1917;">${row.subject}</td></tr>
        <tr><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#92400e;font-weight:bold;">Location</td><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#1c1917;">${row.location}</td></tr>
        <tr><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#92400e;font-weight:bold;">Message</td><td style="padding:9px 0;border-bottom:1px solid #fed7aa;color:#1c1917;">${row.message || "No message"}</td></tr>
        <tr><td style="padding:9px 0;color:#92400e;font-weight:bold;">Date</td><td style="padding:9px 0;color:#1c1917;">${formattedDate}</td></tr>
      </table>
    </div>`;

  const studentHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#f97316;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">MyClasses</h1>
      </div>
      <div style="background:#fff8f0;padding:32px;border-radius:0 0 8px 8px;border:1px solid #fed7aa;text-align:center;">
        <h2 style="color:#1c1917;font-size:20px;margin:0 0 16px;">Request Received!</h2>
        <p style="color:#57534e;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Dear <strong>${row.name}</strong>,<br/><br/>
          Your free demo class request has been received. Our team will contact you within <strong>24 hours</strong>.
        </p>
        <p style="color:#a8a29e;font-size:13px;margin:24px 0 0;padding-top:20px;border-top:1px solid #fed7aa;">— MyClasses Team</p>
      </div>
      <p style="color:#a8a29e;font-size:12px;text-align:center;margin-top:16px;">Copyright MyClasses 2025. All rights reserved.</p>
    </div>`;

  const [adminResult, studentResult] = await Promise.allSettled([
    resend.emails.send({
      from: "MyClasses <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: "New Enquiry Received - MyClasses",
      text: adminText,
      html: adminHtml,
    }),
    resend.emails.send({
      from: "MyClasses <onboarding@resend.dev>",
      to: row.email,
      subject: "Your Free Demo Class Request is Confirmed — MyClasses",
      html: studentHtml,
    }),
  ]);

  if (adminResult.status === "rejected")
    console.error("Admin email failed:", adminResult.reason);
  else if (adminResult.value.error)
    console.error("Admin email error:", adminResult.value.error);
  else console.log("Admin email sent:", adminResult.value.data?.id);

  if (studentResult.status === "rejected")
    console.error("Student email failed:", studentResult.reason);
  else if (studentResult.value.error)
    console.error("Student email error:", studentResult.value.error);
  else console.log("Student email sent:", studentResult.value.data?.id);
}

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());

// ── API Routes ────────────────────────────────────────────────────────────────

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/enquiries", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM enquiries ORDER BY created_at DESC"
    );
    res.json(result.rows.map(rowToEnquiry));
  } catch (err) {
    console.error("Failed to fetch enquiries:", err);
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

app.post("/api/enquiries", async (req, res) => {
  const { name, phone, email, boardClass, subject, location, message } =
    req.body;

  if (!name || !phone || !email || !boardClass || !subject || !location) {
    return res.status(400).json({ error: "All required fields must be filled" });
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    return res
      .status(400)
      .json({ error: "Phone number must be exactly 10 digits" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO enquiries (name, phone, email, board_class, subject, location, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, phone, email, boardClass, subject, location, message || null]
    );
    const row = result.rows[0];
    sendEmails(row).catch((err) => console.error("Email send error:", err));
    res.status(201).json(rowToEnquiry(row));
  } catch (err) {
    console.error("Failed to create enquiry:", err);
    res.status(500).json({ error: "Failed to create enquiry" });
  }
});

// ── Static Frontend ───────────────────────────────────────────────────────────

const staticDir = path.join(__dirname, "artifacts", "myclasses", "dist", "public");

if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
  // SPA fallback — send index.html for all non-API routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "MyClasses API running. Frontend not built yet." });
  });
}

// ── Start ─────────────────────────────────────────────────────────────────────

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB init failed:", err);
    process.exit(1);
  });
