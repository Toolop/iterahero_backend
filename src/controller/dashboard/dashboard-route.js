const { getCountDashboard } = require("./handler/dashboard-count-handler");
const prefix = require('../../utils/prefix-utils.js');

module.exports = [
    {
		method: "GET",
		path: `${prefix}/dashboard`,
		config: { auth: "jwt" },
		handler: getCountDashboard,
	},
]