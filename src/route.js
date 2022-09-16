const { register, login } = require("./handler/user-handler.js");
const {
	getGreenHouses,
	getGreenHouseDetail,
	uploadGreenHouse,
	updateGreenhouse,
	deleteGreenhouse
} = require("./handler/greenhouse-handler.js");
const {
	uploadActuator,
	getActuators,
	getActuatorDetail,
} = require("./handler/actuator-handler.js");
const {
	uploadActuatorLog,
	getActuatorLogs,
	getActuatorLogDetail,
} = require("./handler/actuator-log-handler.js");
const {
	uploadCategorySensor,
	getCategorySensor,
} = require("./handler/category-handler.js");
const { uploadNotification } = require("./handler/notification-handler.js");
const {
	uploadSensor,
	getSensorByGreenHouse,
	getSensorById,
} = require("./handler/sensor-handler.js");
const {
	uploadSensorLog,
	getSensorLogBySensor,
	getSensorLogDetail,
} = require("./handler/sensor-log-handler.js");
const { handler } = require("@hapi/hapi/lib/cors.js");

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
		path: `${prefix}/actuator`,
		config: {
			auth: "jwt",
			payload: {
				multipart: true,
			},
		},
		handler: uploadActuator,
	},
	{
		method: "POST",
		path: `${prefix}/actuator-log`,
		config: {
			auth: "jwt",
			payload: {
				multipart: true,
			},
		},
		handler: uploadActuatorLog,
	},
	{
		method: "GET",
		path: `${prefix}/actuator`,
		config: { auth: "jwt" },
		handler: getActuators,
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
	{
		method: "POST",
		path: `${prefix}/sensor`,
		config: {
			auth: "jwt",
			payload: {
				multipart: true,
			},
		},
		handler: uploadSensor,
	},
	{
		method: "GET",
		path: `${prefix}/actuator/{id}`,
		config: { auth: "jwt" },
		handler: getActuatorDetail,
	},
	{
		method: "GET",
		path: `${prefix}/sensor`,
		config: { auth: "jwt" },
		handler: getSensorByGreenHouse,
	},
	{
		method: "GET",
		path: `${prefix}/sensor/{id}`,
		config: { auth: "jwt" },
		handler: getSensorById,
	},
	{
		method: "POST",
		path: `${prefix}/sensor-log`,
		config: { auth: "jwt" },
		handler: uploadSensorLog,
	},
	{
		method: "GET",
		path: `${prefix}/sensor-log`,
		config: { auth: "jwt" },
		handler: getSensorLogBySensor,
	},
	{
		method: "GET",
		path: `${prefix}/sensor-log/{id}`,
		config: {auth:"jwt"},
		handler: getSensorLogDetail,
	},
	{
		method: "GET",
		path: `${prefix}/actuator-log`,
		config: { auth: "jwt" },
		handler: getActuatorLogs,
	},
	{
		method: "GET",
		path: `${prefix}/actuator-log/{id}`,
		config: { auth: "jwt" },
		handler: getActuatorLogDetail,
	},
	{
		method: "POST",
		path: `${prefix}/notification`,
		config: {
			auth: "jwt",
		},
		handler: uploadNotification,
	},
	{
		method: "PUT",
		path : `${prefix}/greenhouse/{id}`,
		config:{
			auth: "jwt",
			payload: {
				multipart: true,
			},
		},
		handler: updateGreenhouse,
	},
	{
		method: "Delete",
		path : `${prefix}/greenhouse/{id}`,
		config:{
			auth: "jwt",
		},
		handler: deleteGreenhouse,
	}
];

module.exports = routes;
