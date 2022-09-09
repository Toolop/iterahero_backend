const pg = require("pg");

const pool = new pg.Pool({
	ssl: {
		rejectUnauthorized: false,
	},
});

module.exports = pool;
