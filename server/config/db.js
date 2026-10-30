const mysql = require("mysql2/promise");
const fs = require("fs");
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

// Load the Aiven CA certificate from Render Secret Files.
// Fall back to environment-variable certificate values if needed.
let sslCa = null;

if (fs.existsSync("/etc/secrets/ca.pem")) {
  sslCa = fs.readFileSync("/etc/secrets/ca.pem", "utf8");
} else if (process.env.DB_SSL_CA_BASE64) {
  sslCa = Buffer.from(process.env.DB_SSL_CA_BASE64, "base64").toString("utf8");
} else if (process.env.DB_SSL_CA) {
  sslCa = process.env.DB_SSL_CA;
}

if (sslCa) {
  dbConfig.ssl = {
    ca: sslCa,
    rejectUnauthorized: true,
  };
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;
