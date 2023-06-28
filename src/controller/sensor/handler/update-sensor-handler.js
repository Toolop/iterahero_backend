const pool = require("../../../config/db");
const { uploadImage, changeHttps } = require("../../../utils/cloudinary");
const {
  isSensorExist,
  deletimageSensor,
  deletimagePosistion,
  getSensor,
} = require("../../../utils/sensor-utils");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const updateSensor = async (request, h) => {
  const { id } = request.params;
  const {
    name,
    unit_measurement,
    brand,
    color,
    icon,
    range_min,
    range_max,
    id_category_sensor,
    calibration,
    detail,
  } = request.payload;
  let { sensor_image, posisition } = request.payload;
  let result = "";
  let response = "";
  let Sensor = "";

  try {
    if (await isSensorExist(id)) {
      const updated_at = getLocalISOString();
      if (sensor_image) {
        await deletimageSensor(id);
        const sensor_image_payload = await uploadImage(
          "sensor_images",
          sensor_image
        );
        let getCount = sensor_image_payload.url.length;
        let getUrl = sensor_image_payload.url.slice(4, getCount);
        let addText = "https";
        sensor_image = addText + getUrl;
      } else {
        Sensor = await getSensor(id);
        sensor_image = Sensor.sensor_image;
      }
      if (posisition) {
        await deletimagePosistion(id);
        const posistion_payload = await uploadImage(
          "sensor_images",
          posisition
        );
        let getCount = posistion_payload.url.length;
        let getUrl = posistion_payload.url.slice(4, getCount);
        let addText = "https";
        posisition = addText + getUrl;
      } else {
        Sensor = await getSensor(id);
        posisition = Sensor.posisition;
      }

      result = await pool.query(
        'UPDATE public."sensor" SET "name"=$1, unit_measurement=$2, brand=$3, updated_at=$4, icon=$5, color=$6, range_min = $7,range_max = $8,id_category_sensor = $9, calibration = $10, detail=$11,sensor_image = $12,posisition=$13 WHERE id_sensor = $14',
        [
          name,
          unit_measurement,
          brand,
          updated_at,
          icon,
          color,
          range_min,
          range_max,
          id_category_sensor,
          calibration,
          detail,
          sensor_image,
          posisition,
          id,
        ]
      );

      if (result) {
        response = h.response({
          code: 200,
          status: "OK",
          message: "Sensor has been edited successfully",
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Sensor cannot be edited",
        });

        response.code(500);
      }
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Sensor is not found",
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
  updateSensor,
};
