const prefix = require('../../utils/prefix-utils.js');
const { login } = require('./handler/user-login-handler.js');
const { register } = require('./handler/user-register-handler.js');

module.exports = [
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
	
]