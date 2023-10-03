const prefix = require("../../utils/prefix-utils");
const { getHandler } = require("./handler/getHandler");
const path = `${prefix}/tandonUtama`

module.exports = [
    {
        method: "GET",
        path,
        handler: getHandler
    }
]