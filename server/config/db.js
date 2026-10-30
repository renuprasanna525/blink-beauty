const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const secretFileCandidates = [
  "/etc/secrets/ca.pem",
  path.join(process.cwd(), "ca.pem"),
];

const foundSecretFile = secretFileCandidates.find((file) =>
  fs.existsSync(file)
);

let sslCa = null;
let certificateSource = "none";

if (foundSecretFile) {
  sslCa = fs.readFileSync(foundSecretFile, "utf8");
  certificateSource = foundSecretFile;
} else if (process.env.DB_SSL_CA) {
  sslCa = process.env.DB_SSL_CA;
  certificateSource = "PEM environment variable";
}

console.log("Application working directory:", process.cwd());
console.log(
  "Secret file paths found:",
  secretFileCandidates.filter((file) => fs.existsSync(file))
);
console.log("SSL certificate source:", certificateSource);

if (sslCa) {
  const body = sslCa.replace(
    /-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\s/g,
    ""
  );
  const der = Buffer.from(body, "base64");

  console.log("SSL certificate bytes:", der.length);
  console.log(
    "SSL certificate SHA256:",
    crypto.createHash("sha256").update(der).digest("hex")
  );

  dbConfig.ssl = {
    ca: sslCa,
    rejectUnauthorized: true,
  };
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;
