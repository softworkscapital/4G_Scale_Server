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
app.use(express.json());
app.use(cors(corsOptions));
// app.use(bodyParser.json({ limit: "100mb" }));

let gasData = [];

app.post("/", async (req, res) => {
  console.log("now posting");
  const data = req.body;

  if (!data) {
    return res.status(400).json({ message: "User not found" });
  }

  gasData.push(data);

  const filePath = "gasData.txt";
  const content = `[${new Date().toISOString()}] ${JSON.stringify(data)}\n`;

  // Check if file exists, create if not, then append data
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist, create and write
      fs.writeFile(filePath, content, (err) => {
        if (err) console.error("Error creating file:", err);
        else console.log("File created and data written.");
      });
    } else {
      // File exists, just append
      fs.appendFile(filePath, content, (err) => {
        if (err) console.error("Error appending to file:", err);
        else console.log("Data appended to file.");
      });
    }
  });

  return res.sendStatus(200);
});


app.get("/data", (req, res) => {
  return res.json({ gasData });
});

app.get("/", (req, res) => {
  return res.send("4G Scale Server");
});

// const options = {
//   cert: fs.readFileSync(
//     "/etc/letsencrypt/live/srv547457.hstgr.cloud/fullchain.pem"
//   ),
//   key: fs.readFileSync(
//     "/etc/letsencrypt/live/srv547457.hstgr.cloud/privkey.pem"
//   ),
// };

// https.createServer(options, app).listen(PORT || "4002", () => {
//   console.log("app is listening to port" + PORT);
// });

app.listen(PORT, () => {
  console.log("app is listening to port" + " " + PORT);
});
