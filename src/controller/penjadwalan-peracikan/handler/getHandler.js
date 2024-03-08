const Boom = require("@hapi/boom");
const { prisma } = require("../../../config/prisma");

const getHandler = async (request, h) => {
    try {
        const data = await prisma.penjadwalan.findMany({
            where: {

            }
        })

        if (!data) {
            return Boom.notFound("Tidak ada data penjadwalan")
        }
        return h.response({
            status: 'success',
            data
        }).code(200)
    }
    catch (e) {
        console.log(e)
        if (e instanceof Error) {
            return Boom.internal(e.message)
        }
    }
}

module.exports = { getHandler }