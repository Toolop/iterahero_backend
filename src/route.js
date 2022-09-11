const { register, login } = require("./handler/user-handler.js");
const { getGreenHouses } = require("./handler/greenhouse-handler.js");
const prefix = "/api/v1";

const routes = [
	{
		method: "POST",
		path: `${prefix}/register`,
		config: { auth: false },
		handler: register,
	},
	{
		method: "POST",
		path: `${prefix}/login`,
		config: { auth: false },
		handler: login,
	},
	{
		method: "GET",
		path: `${prefix}/greenhouse`,
        config: { auth: "jwt" },
		handler: getGreenHouses,
	},
];

module.exports = routes;
