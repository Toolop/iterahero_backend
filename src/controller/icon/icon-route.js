const prefix = require('../../utils/prefix-utils.js');
const { uploadIcon } = require('./handler/add-icon-handler.js');
const { getIcon } = require('./handler/get-icon-handler.js');

module.exports = [
    {
		method: "POST",
		path: `${prefix}/icon`,
		config: { 
			payload: {
				multipart: true,
			},
			auth: false,
		 },
		handler: uploadIcon,
	},
	{
		method: "GET",
		path: `${prefix}/icon`,
		config: { 
			auth: false,
		 },
		handler: getIcon,
	},
]