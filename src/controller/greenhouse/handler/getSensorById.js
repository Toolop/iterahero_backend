const { prisma } = require("../../../config/prisma");

const getSensorById = async (request, h) => {
    try {
        const { id } = request.params;
        const data = await prisma.sensor.findMany({
            where: {
                id_greenhouse: parseInt(id)
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
        }).code(200)
    }
    catch(e) {
        console.error(e)
        return h.response({
            status: "Error",
            code: 500,
            message: e.message
        }).code(500)
    }
}

module.exports = { getSensorById }