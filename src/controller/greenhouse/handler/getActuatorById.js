const { prisma } = require("../../../config/prisma");

const getActuatorById = async (request, h) => {
    try {
        const { id } = request.params;
        const data = await prisma.actuator.findMany({
            where: {
                id_greenhouse: parseInt(id)
            },
            include: {
                category: true,
                microcontroller: true
            }
        });
        return h.response({
            status: "Ok",
            code: 200,
            data
        }).code(200)
    }
    catch (e) {
        console.error(e);
        return h.response({
            status: "Error",
            code: 500,
            message: "Internal Server Error"
        }).code(500)
    }
}

module.exports = { getActuatorById };