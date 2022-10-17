const { register, login } = require("./handler/user-handler.js");
const {
	getGreenHouses,
	getGreenHouseDetail,
	uploadGreenHouse,
	updateGreenhouse,
	deleteGreenhouse,
} = require("./handler/greenhouse-handler.js");
const {
	uploadActuator,
	getActuators,
	getActuatorDetail,
	updateActuator,
	deleteActuator,
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
const {
	uploadNotification,
	getNotifications,
	deleteNotification,
	getNotificationDetail,
} = require("./handler/notification-handler.js");
const {
	uploadSensor,
	getSensorByGreenHouse,
	getSensorById,
	updateSensor,
	deleteSensor,
} = require("./handler/sensor-handler.js");
const {
	uploadSensorLog,
	getSensorLogBySensor,
	getSensorLogDetail,
} = require("./handler/sensor-log-handler.js");
const { getCountDashboard } = require("./handler/dashboard-count-handler");
const { uploadImageServer,getImageServer } = require("./handler/image-handler");
const {uploadSensorBroker,getSensorBroker} = require("./handler/sensor-broker-handler");
const {getGrafik, getHistorySensor} = require('./handler/grafik-handler')

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
		config: { auth: "jwt" },
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
		path: `${prefix}/greenhouse/{id}`,
		config: {
			auth: "jwt",
			payload: {
				multipart: true,
			},
		},
		handler: updateGreenhouse,
	},
	{
		method: "DELETE",
		path: `${prefix}/greenhouse/{id}`,
		config: {
			auth: "jwt",
		},
		handler: deleteGreenhouse,
	},
	{
		method: "PUT",
		path: `${prefix}/sensor/{id}`,
		config: {
			auth: "jwt",
			payload: {
				multipart: true,
			},
		},
		handler: updateSensor,
	},
	{
		method: "DELETE",
		path: `${prefix}/sensor/{id}`,
		config: {
			auth: "jwt",
		},
		handler: deleteSensor,
	},
	{
		method: "PUT",
		path: `${prefix}/actuator/{id}`,
		config: {
			auth: "jwt",
			payload: {
				multipart: true,
			},
		},
		handler: updateActuator,
	},
	{
		method: "DELETE",
		path: `${prefix}/actuator/{id}`,
		config: { auth: "jwt" },
		handler: deleteActuator,
	},
	{
		method: "GET",
		path: `${prefix}/notification`,
		config: { auth: "jwt" },
		handler: getNotifications,
	},
	{
		method: "GET",
		path: `${prefix}/dashboard`,
		config: { auth: "jwt" },
		handler: getCountDashboard,
	},
	{
		method: "DELETE",
		path: `${prefix}/notification/{id}`,
		config: { auth: "jwt" },
		handler: deleteNotification,
	},
	{
		method: "GET",
		path: `${prefix}/notification/{id}`,
		config: { auth: "jwt" },
		handler: getNotificationDetail,
	},
	{
		method: "POST",
		path: `${prefix}/upload/ml`,
		config: { 
			auth: false,
			payload: {
				multipart: true,
			},
		 },
		handler: uploadImageServer,
	},
	{
		method: "GET",
		path: `${prefix}/ml`,
		config: { 
			auth: false,
		 },
		handler: getImageServer,
	},
	{
		method: "POST",
		path: `${prefix}/sensor_broker`,
		config: { 
			auth: false,
		 },
		handler: uploadSensorBroker,
	},
	{
		method: "GET",
		path: `${prefix}/sensor_broker`,
		config: { 
			auth: false,
		 },
		handler: getSensorBroker,
	},
	{
		method: "GET",
		path: `${prefix}/grafik/{id_sensor}`,
		config: { 
			auth: false,
		 },
		handler: getGrafik,
	},
	{
		method: "GET",
		path: `${prefix}/history/sensor/{id_sensor}`,
		config: { 
			auth: false,
		 },
		handler: getHistorySensor,
	}

];

module.exports = routes;
