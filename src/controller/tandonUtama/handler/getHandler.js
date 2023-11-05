const prisma = require("../../../config/prisma")
const Boom = require("@hapi/boom");

const getHandler = async (request, h) => {
    try {
        const { id_user } = request.auth.credentials;
        const data = await prisma.tandon.findFirst({
            where: {
                userId: id_user
            },
            include: {
                sensor: true,
                penjadwalan: true,
                tandonBahan: {
                    include: {
                        sensor: true,
                    }
                },
            }
        });

        if (!data) {
            return Boom.notFound("Tidak ada tandon yang tersedia");
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