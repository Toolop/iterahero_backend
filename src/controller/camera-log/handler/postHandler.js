const { PrismaClient } = require("@prisma/client");
const prefix = require('../../../utils/prefix-utils');
const { default: axios } = require("axios");
const { uploadImage } = require("../../../utils/cloudinary");

const prisma = new PrismaClient();

const addCameraLog =  async (request, h) => {
    const { id_camera, image } = request.payload;
    let response;

    try {
        let imageBase64 = Buffer.from(image).toString("base64");
        await axios.post("https://detect.roboflow.com/cnn-melon/3", imageBase64, {
            params: {
                api_key: "scvUwcOaTuhifPhPoqVI"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }).then(async (res) => {
            const data = res.data.predictions;
            let classArray = [];
            let kondisi;
            let priority = ["daun kuning", "bercak", "daun sehat"];
            data.forEach((item) => {
                if (!classArray.includes(item.class)) {
                    classArray = [...classArray, item.class]
                }
            });
            for (let i = 0; i < priority.length; i++) {
                if (classArray.includes(priority[i])) {
                    kondisi = priority[i];
                    break;
                }
            }

            const uploadImagePayload = await uploadImage("ml_image", image);
            const secureUrl = uploadImagePayload.secure_url;
            
            await prisma.camera_log.create({
                data: {
                    image: secureUrl,
                    prediction: kondisi,
                    Camera: {
                        connect: {id_camera: parseInt(id_camera)}
                    }
                }
            }).then(insert => {
                response = h.response({
                    status: 'success',
                    secureUrl,
                    kondisi,
                    prediction: data
                }).code(200);
            })
        })
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