const {hello} = require('./handler/user-handler.js')

const prefix = '/api/v1';

const routes = [
    {
        method: 'POST',
        path: `${prefix}`,
        config: { auth: false,payload: {multipart: true} },
        handler: hello
    },
];

module.exports = routes;