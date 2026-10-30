const mysql = require("mysql2/promise");
const fs = require("fs");
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

let sslCa = null;
let certificateSource = "none";

if (fs.existsSync("/etc/secrets/ca.pem")) {
  sslCa = fs.readFileSync("/etc/secrets/ca.pem", "utf8");
  certificateSource = "Render Secret File";
} else if (process.env.DB_SSL_CA_BASE64) {
  sslCa = Buffer.from(process.env.DB_SSL_CA_BASE64, "base64").toString("utf8");
  certificateSource = "Base64 environment variable";
} else if (process.env.DB_SSL_CA) {
  sslCa = process.env.DB_SSL_CA;
  certificateSource = "PEM environment variable";
}

if (sslCa) {
  const body = sslCa.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\s/g, "");
  const der = Buffer.from(body, "base64");

  console.log("SSL certificate source:", certificateSource);
  console.log("SSL certificate bytes:", der.length);
  console.log(
    "SSL certificate SHA256:",
    crypto.createHash("sha256").update(der).digest("hex")
  );

  dbConfig.ssl = {
    ca: sslCa,
    rejectUnauthorized: true,
  };
} else {
  console.log("SSL certificate source: none");
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;
