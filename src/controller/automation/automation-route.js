const prefix = require('../../utils/prefix-utils.js');
const { deleteAutomation } = require('./handler/delete-automation-handler.js');
const { getAllAutomation } = require('./handler/getall-automation-handler.js');
const { getDetailAutomation } = require('./handler/getdetail-automation-handler.js');
const { updateAutomation } = require('./handler/update-automation-handler.js');
const { uploadAutomation } = require('./handler/upload-automation-handler.js');

module.exports = [
    {
		method: "POST",
		path: `${prefix}/automation`,
		config: { 
			auth: "jwt",
		 },
		handler: uploadAutomation,
	},
	{
		method: "GET",
		path: `${prefix}/automation`,
		config: { 
			auth: "jwt",
		 },
		handler: getAllAutomation,
	},
	{
		method: "PUT",
		path: `${prefix}/automation/{id}`,
		config: { 
			auth: "jwt",
		 },
		handler: updateAutomation,
	},
	{
		method: "GET",
		path: `${prefix}/automation/{id}`,
		config: { 
			auth: "jwt",
		 },
		handler: getDetailAutomation,
	},
	{
		method: "DELETE",
		path: `${prefix}/automation/{id}`,
		config: { 
			auth: "jwt",
		 },
		handler: deleteAutomation,
	},
]