const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getCameraLog = async (request, h) => {
    const { id_camera } = request.params;
    let response;

    try {
        data = await prisma.camera_log.findMany({
            where: { id_camera: id_camera }
        })
        response = h.response({
            status: 'success',
            data,
        }).code(200)
    } catch (e) {
        response = h.response({
            status: 'failed',
            message: e
        }).code(400)
    }
    return response
}

module.exports = {
    getCameraLog
}