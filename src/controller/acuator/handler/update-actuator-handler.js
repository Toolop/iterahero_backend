const pool = require("../../../config/db");
const { prisma } = require("../../../config/prisma");
const { isActuatorExist } = require("../../../utils/actuator-util");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const updateActuator = async (request, h) => {
  const { id } = request.params;
  const { name, categoryId, automation } = request.payload;
  let result = "";
  let response = "";

  try {
    if (await isActuatorExist(id)) {
      const updated_at = getLocalISOString();
      if (automation) {
        result = await prisma.actuator.update({
          where: {
            id_actuator: parseInt(id)
          },
          data: {
            automation
          }
        })
      } else {
        result = await prisma.actuator.update({
          where: {
            id_actuator: parseInt(id)
          },
          data: {
            name,
            categoryId
          }
        })
      }
      // if (automation) {
      //   result = await pool.query(
      //     'UPDATE public."actuator" SET automation=$1, updated_at=$2 WHERE id_actuator = $3',
      //     [automation, updated_at, id]
      //   );
      // } else {
      //   result = await pool.query(
      //     'UPDATE public."actuator" SET "name"=$1, updated_at=$2, icon=$3, color=$4 WHERE id_actuator = $5',
      //     [name, updated_at, icon, color, id]
      //   );
      // }

      if (result) {
        response = h.response({
          code: 201,
          status: "OK",
          message: "Actuator has been edited successfully",
        }).code(201);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Actuator cannot be edited",
        }).code(500);
      }
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Actuator is not found",
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
  updateActuator,
};
