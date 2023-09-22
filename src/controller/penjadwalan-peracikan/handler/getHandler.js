const prisma = require("../../../config/prisma");

const getHandler = async (request, h) => {
    let response;
    try {
        const data = await prisma.penjadwalan.findMany();
        response = h.response({
            status: 'success',
            data
        }).code(200)
    }
    catch (e) {
        response = h.response({
            status: 'failed',
            message: e
        })
        console.error(e)
    }
    prisma.$disconnect();
    return response;
}

module.exports = getHandler;