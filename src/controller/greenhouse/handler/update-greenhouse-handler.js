const pool = require("../../../config/db");
const { prisma } = require("../../../config/prisma");
const { uploadImage } = require("../../../utils/cloudinary");
const {
  isGreenhouseExist,
  deletimageGreenhouse,
} = require("../../../utils/greenhouse-util");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const updateGreenhouse = async (request, h) => {
  const { id } = request.params;
  const { name, location } = request.payload;
  let { image } = request.payload;
  let result;
  let response;

  try {
    if (await isGreenhouseExist(id)) {
      if (image) {
        const upload = await uploadImage("greenhouse_images", image);
        if (upload) {
          const result = await prisma.greenhouse.update({
            where: {
              id_greenhouse: parseInt(id)
            },
            data: {
              name,
              image: upload.secure_url,
              location,
            }
          })
          if (result) {
            const deleteImage = await deletimageGreenhouse(id);
            if (deleteImage) {
              response = h.response({
                code: 201,
                status: "OK",
                message: "Greenhouse has been edited successfully",
              }).code(201)
            } else {
              response = h.response({
                code: 500,
                status: "Internal Server Error",
                message: "Failed to delete image"
              }).code(500)
            }
          } else {
            response = h.response({
              code: 500,
              status: "Internal Server Error",
              message: "Failed to Update Greenhouse"
            }).code(500)
          }
        } else {
          response = h.response({
            code: 500,
            status: "Internal Server Error",
            message: "Failed to Upload Greenhouse Image"
          }).code(500)
        }
      } else {
        result = await prisma.greenhouse.update({
          where: {
            id_greenhouse: parseInt(id)
          },
          data: {
            name,
            location
          }
        })
        if (result) {
          response = h.response({
            code: 201,
            status: "OK",
            message: "Greenhouse has been edited successfully",
          }).code(201);
        } else {
          response = h.response({
            code: 500,
            status: "Internal Server Error",
            message: "Greenhouse cannot be edited",
          }).code(500);
        }
      }
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Greenhouse is not found",
      }).code(404);
    }
  } catch (err) {
    response = h.response({
      code: 400,
      status: "Bad Request",
      message: "error",
    }).code(400);

    console.log(err);
  }

  return response;
};
module.exports = {
  updateGreenhouse,
};
