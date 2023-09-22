const prefix = require("../../utils/prefix-utils");
const getHandler = require("./handler/getHandler");
const postHandler = require("./handler/postHandler");

path = `${prefix}/penjadwalan`;

module.exports = [
    {
        method: "GET",
        path,
        config: {
            auth: "jwt"
        },
        handler: getHandler
    },
    {
        method: "POST",
        path,
        config: {
            auth: "jwt"
        },
        handler: postHandler
    },
    // {
    //     method: "PATCH",
    //     path,
    //     config: {
    //         auth: "jwt",
    //     }
    // }, {
    //     method: "DELETE",
    //     path,
    //     config: {
    //         auth: "jwt"
    //     },
    // }
]