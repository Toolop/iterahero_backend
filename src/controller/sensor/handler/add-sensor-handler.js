const pool = require("../../../config/db");
const { uploadImage, changeHttps } = require("../../../utils/cloudinary");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const uploadSensor = async (request, h) => {
  const {
    name,
    unit_measurement,
    brand,
    color,
    icon,
    id_greenhouse,
    range_min,
    range_max,
    id_category_sensor,
    calibration,
    detail,
  } = request.payload;

  let { sensor_image, posisition } = request.payload;

  let response = "";

  try {
    if (sensor_image != "null") {
      const sensor_image_payload = await uploadImage(
        "sensor_images",
        sensor_image
      );
      let getCount = sensor_image_payload.url.length;
      let getUrl = sensor_image_payload.url.slice(4, getCount);
      let addText = "https";
      sensor_image = addText + getUrl;
    }
    if (posisition != "null") {
      const posistion_payload = await uploadImage("sensor_images", posisition);
      let getCount = posistion_payload.url.length;
      let getUrl = posistion_payload.url.slice(4, getCount);
      let addText = "https";
      posisition = addText + getUrl;
    }

    const created_at = getLocalISOString();

    const result = await pool.query(
      `INSERT INTO public.sensor ("name", unit_measurement, brand, created_at, updated_at, icon, color, id_greenhouse, range_min, range_max, id_category_sensor,calibration,detail,sensor_image,posisition) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *;`,
      [
        name,
        unit_measurement,
        brand,
        created_at,
        created_at,
        icon,
        color,
        id_greenhouse,
        range_min,
        range_max,
        id_category_sensor,
        calibration,
        detail,
        sensor_image,
        posisition,
      ]
    );

    if (result) {
      response = h.response({
        code: 201,
        status: "Created",
        message: "Sensor successfully created",
        data: {
          id: result.rows[0].id_sensor,
          name: result.rows[0].name,
          brand: result.rows[0].brand,
          icon: result.rows[0].icon,
          unit_measurement: result.rows[0].unit_measurement,
          color: result.rows[0].color,
          range_min: result.rows[0].range_min,
          range_max: result.rows[0].range_max,
          id_category_sensor: result.rows[0].id_category_sensor,
          created_at: result.rows[0].created_at,
          id_greenhouse: result.rows[0].id_greenhouse,
          calibration: result.rows[0].calibration,
          detail: result.rows[0].detail,
          sensor_image: result.rows[0].sensor_image,
          posisition: result.rows[0].posisition,
        },
      });

      response.code(201);
    } else {
      response = h.response({
        code: 500,
        status: "Internal Server Error",
        message: "Actuator failed to create",
      });
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
  uploadSensor,
};
