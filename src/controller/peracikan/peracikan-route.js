const prefix = require("../../utils/prefix-utils")
const getPeracikan = require("./handler/getPeracikan")
const postHandler = require("./handler/postPeracikan")
const deletePeracikan = require('./handler/deletePeracikan')
const patchPeracikan = require('./handler/patchPeracikan')

module.exports = [
    {
        method: "GET",
        path: `${prefix}/peracikan`,
        config: {
            auth: "jwt"
        },
        handler: getPeracikan
    },
    {
        method: "POST",
        path: `${prefix}/peracikan`,
        config: {
            auth: "jwt"
        },
        handler: postHandler
    },
    {
        method: "DELETE",
        path: `${prefix}/peracikan`,
        config: {
            auth: "jwt"
        },
        handler: deletePeracikan
    },
    {
        method: "PATCH",
        path: `${prefix}/peracikan`,
        config: {
            auth: "jwt"
        },
        handler: patchPeracikan
    }
]   