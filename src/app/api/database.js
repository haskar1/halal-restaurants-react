const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "hussein1!",
  host: "localhost",
  port: 5432, // default Postgres port
  database: "halal-restaurants",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
