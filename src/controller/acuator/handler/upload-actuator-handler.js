const pool = require("../../../config/db");
const { uploadImage, deleteImage } = require("../../../utils/cloudinary");
const { isActuatorExist } = require("../../../utils/actuator-util");
const { getGreenHouseName } = require("../../../utils/greenhouse-util");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const uploadActuator = async (request, h) => {
  const { name, color, id_greenhouse, icon } = request.payload;

  let response = "";

  try {
    const status_lifecycle = 0;

    const created_at = getLocalISOString();

    const result = await pool.query(
      `INSERT INTO public."actuator" (name, status_lifecycle, color, icon, created_at, id_greenhouse) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, status_lifecycle, color, icon, created_at, id_greenhouse]
    );

    if (result) {
      response = h.response({
        code: 201,
        status: "Created",
        message: "Actuator successfully created",
        data: {
          id: result.rows[0].id_actuator,
          name: result.rows[0].name,
          status_lifecycle: result.rows[0].status_lifecycle,
          color: result.rows[0].color,
          icon: result.rows[0].icon,
          created_at: result.rows[0].created_at,
          id_greenhouse: result.rows[0].id_greenhouse,
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
  uploadActuator,
};
