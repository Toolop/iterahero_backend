const prisma = require("../../../config/prisma")
const Boom = require("@hapi/boom");

const sensorByGreenhouseId = async (request, h) => {
    try {
        const id = parseInt(request.params.id)
        const size = parseInt(request.query.size);
        const cursor = parseInt(request.query.cursor);
        const total = await prisma.sensor.count({
            where: {
                id_greenhouse: id
            }
        });
        const data = await prisma.sensor.findMany({
            where: {
                id_greenhouse: id
            },
            cursor: cursor ? { id: cursor } : undefined,
            take: size ? size : 100,
            skip: cursor ? 1 : 0
        })

        // if (!data) {
        //     return Boom.notFound("Tidak ada sensor")
        // }

        return h.response({
            status: "success",
            data,
            cursor: data[data.length - 1].id,
            totalPage: size ? Math.ceil(total / size) : Math.ceil(total / 100)
        }).code(200)
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

module.exports = { sensorByGreenhouseId }