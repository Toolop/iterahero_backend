const prisma = require("../../../config/prisma");

const getPeracikan = async (request, h) => {
    let response;
    try {
        data = await prisma.peracikan.findMany();
        response = h.response({
            status: 'success',
            data
        }).code(200)
        // if (data.length < 1) {
        //     response.code(406)
        // } else {
        //     response.code(200)
        // }
    }
    catch (e) {
        console.error(e)
        response = h.response({
            status: 'failed',
            message: e
        }).code(500)
    }
    prisma.$disconnect();
    return response;
}

module.exports = getPeracikan;