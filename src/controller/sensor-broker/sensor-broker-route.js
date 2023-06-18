const prefix = require('../../utils/prefix-utils.js');
const { getSensorBroker } = require('./handler/get-sensor-broker-handler');
const { uploadSensorBroker } = require('./handler/upload-sensor-broker-handler');

module.exports = [
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
]