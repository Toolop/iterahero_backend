const { prisma } = require("../../../config/prisma")

const getHandlerById = async (request, h) => {
    try {
        const { id } = request.params;
        const data = await prisma.sensor.findMany({
            where: {
                tandonId: parseInt(id)
            },
            include: {
                category: true,
                microcontroller: true
            }
        })
        return h.response({
            status: "Ok",
            code: 200,
            data
        }).code(200);
    }
    catch (e) {
        return h.response({
            status: "Error",
            code: 500,
            message: "Internal Server Error"
        }).code(500)
    }
}

module.exports = { getHandlerById }