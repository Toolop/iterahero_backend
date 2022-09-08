const {hello} = require('./handler/user-handler.js')

const prefix = '/api/v1';

const routes = [
    {
        method: 'get',
        path: `${prefix}`,
        config: { auth: false },
        handler: hello
    },
];

module.exports = routes;