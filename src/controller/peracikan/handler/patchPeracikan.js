const prisma = require("../../../config/prisma");

const patchPeracikan = async (request, h) => {
    let response;
    const { id_peracikan } = request.payload;

    try {
        data = await prisma.peracikan.findUnique({
            where: {
                id_peracikan: id_peracikan
            }
        })
        response = h.response({
            status: 'success',
            data
        }).code(200)
    }
    catch (e) {
        response = h.response({
            status: 'failed',
            message: e
        }).code(500)
    }
    prisma.$disconnect();
    return response;
}

module.exports = patchPeracikan;