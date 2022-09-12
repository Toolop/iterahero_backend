const { register, login } = require("./handler/user-handler.js");
const {
	getGreenHouses,
	getGreenHouseDetail,
	uploadGreenHouse,
} = require("./handler/greenhouse-handler.js");
const {
	uploadCategorySensor,
	getCategorySensor
} = require("./handler/category-handler.js");
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
	{
		method: "GET",
		path: `${prefix}/greenhouse/{id}`,
		config: { auth: "jwt" },
		handler: getGreenHouseDetail,
	},
	{
		method: "POST",
		path: `${prefix}/greenhouse`,
		config: {
			auth: "jwt",
			payload: {
				multipart: true,
			},
		},
		handler: uploadGreenHouse,
	},
	{
		method: "POST",
		path: `${prefix}/category/sensor`,
		config: {
			auth: false,
		},
		handler: uploadCategorySensor,
	},
	{
		method: "GET",
		path: `${prefix}/category/sensor`,
		config: {
			auth: false,
		},
		handler: getCategorySensor,
	},
];

module.exports = routes;
