const prefix = require("../../utils/prefix-utils");
const { getHandler } = require("./handler/getHandler");
const { postHandler } = require("./handler/postHandler");

const path = `${prefix}/resep`

module.exports = [
    {
        method: "GET",
        path,
        handler: getHandler
    },
    {
        method: "POST",
        path,
        handler: postHandler
    }
];