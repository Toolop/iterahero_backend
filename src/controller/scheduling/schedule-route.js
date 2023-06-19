const prefix = require('../../utils/prefix-utils.js');
const { addSchedule } = require('./handler/add-schdule-handler.js');

module.exports = [
    {
		method: "POST",
		path: `${prefix}/schedule`,
		config: { 
			auth: 'jwt',
		 },
		handler: addSchedule,
	},

]