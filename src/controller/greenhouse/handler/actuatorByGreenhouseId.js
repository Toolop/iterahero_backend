const prisma = require("../../../config/prisma")
const Boom = require("@hapi/boom");

const actuatorByGreenhouseId = async (request, h) => {
    try {
        const id = parseInt(request.params.id)
        const data = await prisma.aktuator.findMany({
            where: {
                greenhouseId: id
            }
        })

        if (!data) {
            return Boom.notFound("Tidak ada aktuator")
        }

        return h.response({
            status: "success",
            data
        })
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e)
            return Boom.internal(e.message)
        }
    }
    finally {
        await prisma.$disconnect()
    }
}

module.exports = { actuatorByGreenhouseId }