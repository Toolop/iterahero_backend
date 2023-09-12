const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getCameraLog = async (request, h) => {
    const { id_camera } = request.query;
    let { page, size } = request.query;
    let response;

    try {
        page = parseInt(page) || 1;
        size = parseInt(size) || 10;
        let  offset = (page - 1) * size;
        
        const totalData = await prisma.camera_log.count({
            where: { id_camera: parseInt(id_camera) },
        });
        
        const pagination = {
            totalPage: Math.floor(totalData / size) + 1,
            totalData: parseInt(totalData),
            currentPage: page,
            size
        }

        if (offset > pagination.totalData) {
            pagination.currentPage = pagination.totalPage;
        }

        let data = await prisma.camera.findUnique({
            where: { id_camera: parseInt(id_camera) },
            include: {
                Camera_log: true
            }
        })

        response = h.response({
            status: 'success',
            data,
            pagination
        }).code(200)
    } catch (e) {
        console.log(e);
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