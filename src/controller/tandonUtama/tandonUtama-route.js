const prefix = require("../../utils/prefix-utils");
const { actuatorByTandonId } = require("./handler/actuatorByTandonId");
const { getHandler } = require("./handler/getHandler");
const { sensorByTandonId } = require("./handler/sensorByTandonId");

const path = `${prefix}/tandonUtama`

module.exports = [
    {
        method: "GET",
        path,
        handler: getHandler
    },
    {
        method: "GET",
        path: path + "/{id}/sensor",
        handler: sensorByTandonId
    },
    {
        method: "GET",
        path: path + "/{id}/actuator",
        handler: actuatorByTandonId
    }
]