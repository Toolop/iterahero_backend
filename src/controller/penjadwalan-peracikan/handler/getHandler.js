const Boom = require("@hapi/boom");
const prisma = require("../../../config/prisma");

const getHandler = async (request, h) => {

    const size = parseInt(request.query.size);
    const cursor = parseInt(request.query.cursor);
    try {
        const total = await prisma.penjadwalan.count();
        const data = await prisma.penjadwalan.findMany({
            include: {
                resep: true
            },
            orderBy: [
                {
                    waktu: "asc"
                },
                {
                    hari: "asc"
                }
            ],
            cursor: cursor ? { id: cursor } : undefined,
            take: size ? size : 100,
            skip: cursor ? 1 : 0
        });

        // if (!data) {
        //     return Boom.notFound("Tidak ada data penjadwalan")
        // }

        return h.response({
            status: 'success',
            data,
            cursor: data[data.length - 1]?.id,
            totalPage: size ? Math.ceil(total / size) : Math.ceil(total / 100)
        }).code(200)
    }
    catch (e) {
        console.log(e)
        if (e instanceof Error) {
            return Boom.internal(e.message)
        }
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = { getHandler }