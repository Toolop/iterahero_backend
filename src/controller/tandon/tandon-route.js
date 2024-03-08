const prefix = require("../../utils/prefix-utils");
const { getHandler } = require("./handler/getHandler");
const { getHandlerById } = require("./handler/getHandlerById");
const path = `${prefix}/tandon`

module.exports = [
    {
        method: "GET",
        path,
        handler: getHandler
    },
    {
        method: "GET",
        path: `${prefix}/tandon/{id}/sensor`,
        handler: getHandlerById
    }
]