const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isCameraExist } = require("../../../utils/camera-util");

const updateCamera = async (request, h) => {
  const { id } = request.params;
  const { name } = request.payload;
  let result = "";
  let response = "";

  try {
    if (await isCameraExist(id)) {
      result = await prisma.user.update({
        where: {
          id_camera: id,
        },
        data: {
          name: name,
        },
      });

      if (result) {
        response = h.response({
          code: 200,
          status: "OK",
          message: "Camera has been edited successfully",
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Camera cannot be edited",
        });

        response.code(500);
      }
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Camera is not found",
      });

      response.code(404);
    }
  } catch (err) {
    response = h.response({
      code: 400,
      status: "Bad Request",
      message: "error",
    });

    response.code(400);

    console.log(err);
  }

  return response;
};
module.exports = {
  updateCamera,
};
