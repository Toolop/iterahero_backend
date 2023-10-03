const Boom = require("@hapi/boom")
const prisma = require("../../../config/prisma");

const getHandler = async (request, h) => {
    try {
        const data = await prisma.resep.findMany();

        if (!data) {
            return Boom.notFound("Tidak ada resep tersimpan");
        }

        return h.response({
            status: 'success',
            data
        }).code(200)
    }
    catch (e) {
        if (e instanceof Error) {
            return Boom.internal(e.message)
        }
    }
    prisma.$disconnect();
}

module.exports = { getHandler }