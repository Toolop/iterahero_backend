const prisma = require("../../../config/prisma")
const Boom = require("@hapi/boom");

const getHandler = async (request, h) => {
    try {
        const { id_user } = request.auth.credentials;
        const id = parseInt(request.query.id)
        let data;

        if (isNaN(id)) {
            data = await prisma.tandon.findMany({
                where: {
                    userId: id_user
                },
            });
        } else {
            data = await prisma.tandon.findUnique({
                where: {
                    id
                }
            })
        }

        if (!data) {
            return Boom.notFound("Tidak ada tandon tersebut");
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
    prisma.$disconnect();
}

module.exports = { getHandler }