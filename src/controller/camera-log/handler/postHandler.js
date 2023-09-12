const { PrismaClient } = require("@prisma/client");
const prefix = require('../../../utils/prefix-utils');

const prisma = new PrismaClient();

const addCameraLog =  async (request, h) => {
    const { id_camera, image } = request.payload;
    let response;

    try {
        let imageBase64 = await Buffer.from(image).toString("base64");
        insert = await prisma.camera_log.create({
            data: {
                image: imageBase64,
                Camera: {
                    connect: {id_camera: parseInt(id_camera)}
                }
            }
        })

        response = h.response({
            status: 'success',
            message: insert
        }).code(200);
    } catch(e) {
        console.log(e)
        response = h.response({
            status: 'failed',
            message: e
        }).code(400);
    }
    prisma.$disconnect();
    return response;
}

module.exports = {
    addCameraLog
}