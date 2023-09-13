const { getCameraLog } = require('./handler/getHandler');
const { addCameraLog } = require('./handler/postHandler');

const prefix = require('../../utils/prefix-utils');
const path = `${prefix}/camera-log`;

module.exports = [
    {
        method: "GET",
        path,
        config: {
            auth: "jwt"
        },
        handler: getCameraLog
    },
    {
        method: "POST",
        path,
        config: {
            auth: "jwt",
            payload: {
                multipart: true
            }
        },
        handler: addCameraLog
    }
]