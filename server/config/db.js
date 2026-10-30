const mysql = require("mysql2/promise");
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

// Support Aiven SSL using a Base64-encoded CA certificate.
const sslCa = process.env.DB_SSL_CA_BASE64
  ? Buffer.from(process.env.DB_SSL_CA_BASE64, "base64").toString("utf8")
  : process.env.DB_SSL_CA;

if (sslCa) {
  dbConfig.ssl = {
    ca: sslCa,
    rejectUnauthorized: true,
  };
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;
