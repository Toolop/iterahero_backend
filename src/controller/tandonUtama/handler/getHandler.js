const prisma = require("../../../config/prisma")
const Boom = require("@hapi/boom");

const getHandler = async (request, h) => {
    try {
        const { id } = request.query;
        const data = await prisma.tandon.findFirst({
            where: {
                id
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
    prisma.$disconnect();
}

module.exports = { getHandler }