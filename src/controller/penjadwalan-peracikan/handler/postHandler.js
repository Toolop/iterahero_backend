const prisma = require("../../../config/prisma");

const postHandler = async (request, h) => {
    let response;
    const { jam, interval, perulangan } = request.payload;

    try {
        let insert = await prisma.penjadwalan.create({
            data: {
                waktu: jam,
                interval: parseInt(interval),
                iterasi: parseInt(perulangan)
            }
        })
        response = h.response({
            status: 'success',
            insert
        }).code(200);
    }
    catch (e) {
        console.error(e);
        let response = h.response({
            status: 'failed',
            message: e
        }).code(500);
    }
    prisma.$disconnect()
    return response
}

module.exports = postHandler;