const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isCameraExist } = require("../../../utils/camera-util");

const deleteCamera = async (request, h) => {
  const { id } = request.params;
  let result = "";
  let response = "";

  try {
    if (await isCameraExist(id)) {
      result = await prisma.user.delete({
        where: {
          id_camera: id,
        },
      });

      if (result) {
        response = h.response({
          code: 200,
          status: "OK",
          message: "Camera has been deleted successfully",
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Camera cannot be deleted",
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
  deleteCamera,
};
