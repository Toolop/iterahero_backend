const { prisma } = require("../../../config/prisma")
const Boom = require("@hapi/boom");

const getHandler = async (request, h) => {
    try {
        const { id } = parseInt(request.query.id);
        const { id_user } = request.auth.credentials;
        const data = await prisma.tandon.findMany({
            where: {
                userId: id_user
            }
        })

        if (!data) {
            return Boom.notFound("Tidak ada tandon terpilih");
        }

        return h.response({
            status: 'success',
            data
        }).code(200);
    }
    catch (e) {
        if (e instanceof Error) {
            console.log(e);
            return Boom.internal(e.message)
        }
    }
}

module.exports = { getHandler }