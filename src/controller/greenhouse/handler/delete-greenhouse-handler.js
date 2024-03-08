const pool = require("../../../config/db");
const { prisma } = require("../../../config/prisma");
const {
  isGreenhouseExist,
  deletimageGreenhouse,
} = require("../../../utils/greenhouse-util");

const deleteGreenhouse = async (request, h) => {
  const { id } = request.params;
  let result = "";
  let response = "";

  try {
    if (await isGreenhouseExist(id)) {
      await deletimageGreenhouse(id);

      result = await prisma.greenhouse.delete({
        where: {
          id_greenhouse: parseInt(id)
        }
      })
      // result = await pool.query(
      //   'DELETE FROM public."greenhouse" WHERE id_greenhouse=$1',
      //   [id]
      // );

      if (result) {
        response = h.response({
          code: 201,
          status: "OK",
          message: "Greenhouse has been deleted",
        }).code(201);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Greenhouse cannot be deleted",
        });

        response.code(500);
      }
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Greenhouse is not found",
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
  deleteGreenhouse,
};
