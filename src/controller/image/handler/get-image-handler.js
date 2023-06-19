const pool = require("../../../config/db");

const getImageServer = async (request, h) => {
  const { email, date, kamera } = request.query;
  let response = "";
  let result = "";

  try {
    if (email) {
      result = await pool.query(
        'SELECT * FROM public."ml_image" WHERE email = $1 ORDER BY created_at ASC',
        [email]
      );
    } else if (date) {
      result = await pool.query(
        `SELECT * FROM public."ml_image" WHERE created_at::date = '%${date}%' ORDER BY created_at ASC`
      );
    } else if (kamera) {
      result = await pool.query(
        `SELECT * FROM public."ml_image" WHERE camera = $1 ORDER BY created_at ASC`,
        [kamera]
      );
    }

    response = h.response({
      code: 200,
      status: "OK",
      data: await Promise.all(
        result.rows.map(async (image) => ({
          created_at: image.created_at,
          email: image.email,
          image: image.image,
          camera: image.camera,
          line: image.line,
          condition: image.condition,
          id_sensor: image.id_sensor,
        }))
      ),
    });

    response.code(200);
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

module.exports = { getImageServer };
