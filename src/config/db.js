const pg = require("pg");

const pool = new pg.Pool({
	ssl: false,
});

module.exports = pool;