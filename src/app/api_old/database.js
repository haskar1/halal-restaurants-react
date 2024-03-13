const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString:
    "postgres://default:7kBIYePduVK6@ep-misty-meadow-41666155-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
