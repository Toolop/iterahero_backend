const pool = require("../../../config/db");
const { uploadImage } = require("../../../utils/cloudinary");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const uploadActuator = async (request, h) => {
  const { name, color, id_greenhouse, icon, detailact } = request.payload;
  let { actuator_image, posisitionact } = request.payload;

  let response = "";

  try {
    if (actuator_image != "null") {
      const actuator_image_payload = await uploadImage(
        "actuator_images",
        actuator_image
      );
      let getCount = actuator_image_payload.url.length;
      let getUrl = actuator_image_payload.url.slice(4, getCount);
      let addText = "https";
      actuator_image = addText + getUrl;
    }
    if (posisitionact != "null") {
      const posistion_payload = await uploadImage(
        "actuator_images",
        posisitionact
      );
      let getCount = posistion_payload.url.length;
      let getUrl = posistion_payload.url.slice(4, getCount);
      let addText = "https";
      posisitionact = addText + getUrl;
    }
    const status_lifecycle = 0;

    const created_at = getLocalISOString();

    const result = await pool.query(
      `INSERT INTO public."actuator" (name, status_lifecycle, color, icon, created_at, id_greenhouse, detailact, actuator_image,posisitionact) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        name,
        status_lifecycle,
        color,
        icon,
        created_at,
        id_greenhouse,
        detailact,
        actuator_image,
        posisitionact,
      ]
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
