const {
	uploadCategorySensor,
	getCategorySensor,
} = require("./handler/category-handler");
const prefix = require('../../utils/prefix-utils.js');

module.exports = [
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
]