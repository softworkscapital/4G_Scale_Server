const express = require("express");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

const app = express();

const corsOptions = {
  origin: "*", // Adjust this to your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

const PORT = 4002;
const LOG_FILE = "gasData.txt";

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Internal memory storage (optional)
let gasData = [];

// ========= LOGGER SETUP ==========

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

const appendToLogFile = (label, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `------------\n[${timestamp}] ${label}:\n${message}\n`;
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) originalConsoleError("❌ Failed to write to log file:", err.message);
  });
};

console.log = (...args) => {
  const message = args.map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg, null, 2))).join(" ");
  appendToLogFile("📝 LOG", message);
  originalConsoleLog(...args);
};

console.error = (...args) => {
  const message = args.map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg, null, 2))).join(" ");
  appendToLogFile("❌ ERROR", message);
  originalConsoleError(...args);
};

// ========= ROUTES ==========

// POST handler for saving gas data
app.post("/", async (req, res) => {
  console.log("now posting");
  const data = req.body;

  if (!data) {
    const errorMessage = "User not found";
    console.error(errorMessage);
    return res.status(400).json({ message: errorMessage });
  }

  gasData.push(data);

  // Save posted data to text file with formatting
  appendToLogFile("✅ DATA RECEIVED", JSON.stringify(data, null, 2));

  return res.sendStatus(200);
});

// View all posted data
app.get("/data", (req, res) => {
  return res.json({ gasData });
});

// Default route
app.get("/", (req, res) => {
  return res.send("4G Scale Server");
});

// ========= HTTPS Support (commented out) ==========
// const options = {
//   cert: fs.readFileSync("/etc/letsencrypt/live/srv547457.hstgr.cloud/fullchain.pem"),
//   key: fs.readFileSync("/etc/letsencrypt/live/srv547457.hstgr.cloud/privkey.pem"),
// };

// https.createServer(options, app).listen(PORT || "4002", () => {
//   console.log("app is listening to port " + PORT);
// });

// ========= START SERVER ==========
app.listen(PORT, () => {
  console.log("app is listening to port " + PORT);
});
