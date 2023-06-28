const pool = require("../../../config/db");
const {
  isActuatorExist,
  deletimageActuator,
  deletimagePosistionAct,
  getActuator,
} = require("../../../utils/actuator-util");
const { uploadImage } = require("../../../utils/cloudinary");
const { updateScheduleUtil } = require("../../../utils/schedule-util");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const updateActuator = async (request, h) => {
  const { id } = request.params;
  const { name, color, icon, automation, detailact } = request.payload;
  let { actuator_image, posisitionact } = request.payload;
  let result = "";
  let response = "";
  let actuator = "";

  try {
    if (await isActuatorExist(id)) {
      const updated_at = getLocalISOString();

      if (automation) {
        result = await pool.query(
          'UPDATE public."actuator" SET automation=$1, updated_at=$2 WHERE id_actuator = $3',
          [automation, updated_at, id]
        );
      } else {
        if (actuator_image) {
          await deletimageActuator(id);
          const sensor_image_payload = await uploadImage(
            "actuator_images",
            actuator_image
          );
          let getCount = sensor_image_payload.url.length;
          let getUrl = sensor_image_payload.url.slice(4, getCount);
          let addText = "https";
          actuator_image = addText + getUrl;
        } else {
          actuator = await getActuator(id);
          actuator_image = actuator.actuator_image;
        }
        if (posisitionact) {
          await deletimagePosistionAct(id);
          const posistion_payload = await uploadImage(
            "actuator_images",
            posisitionact
          );
          let getCount = posistion_payload.url.length;
          let getUrl = posistion_payload.url.slice(4, getCount);
          let addText = "https";
          posisitionact = addText + getUrl;
        } else {
          actuator = await getActuator(id);
          posisitionact = actuator.posisitionact;
        }
        result = await pool.query(
          'UPDATE public."actuator" SET "name"=$1, updated_at=$2, icon=$3, color=$4,detailact=$5,actuator_image=$6,posisitionact=$7 WHERE id_actuator = $8',
          [
            name,
            updated_at,
            icon,
            color,
            detailact,
            actuator_image,
            posisitionact,
            id,
          ]
        );
      }

      if (result) {
        await updateScheduleUtil();
        response = h.response({
          code: 200,
          status: "OK",
          message: "Actuator has been edited successfully",
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Actuator cannot be edited",
        });

        response.code(500);
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
