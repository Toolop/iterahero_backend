const prefix = require('../../utils/prefix-utils.js');
const { deleteActuator } = require('./handler/delete-actuator-handler.js');
const { getActuatorDetail } = require('./handler/detail-actuator-handler.js');
const { getActuators } = require('./handler/get-actuator-handler.js');
const { updateActuator } = require('./handler/update-actuator-handler.js');
const { uploadActuator } = require('./handler/upload-actuator-handler.js');

module.exports = [
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
		method: "GET",
		path: `${prefix}/actuator`,
		config: { auth: "jwt" },
		handler: getActuators,
	},
	{
		method: "GET",
		path: `${prefix}/actuator/{id}`,
		config: { auth: "jwt" },
		handler: getActuatorDetail,
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
]