const {register} = require('./handler/user-handler.js')

const prefix = '/api/v1';

const routes = [
    {
        method: 'POST',
        path: `${prefix}/register`,
        config: { auth: false },
        handler: register
    },
];

module.exports = routes;