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

  console.log(data);

  if (!data) {
    return res.status(400).json({ message: "User not found" });
  }

  gasData.push(data);
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
