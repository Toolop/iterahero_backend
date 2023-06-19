const pool = require("../../../config/db");

const uploadIcon = async (request, h) => {
  let { name, icon, type, color } = request.payload;

  let response = "";

  try {
    const result = await pool.query(
      `INSERT INTO public."icon" (name,icon,type,color) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, icon, type, color]
    );

    if (result) {
      response = h.response({
        code: 201,
        status: "Created",
        message: "icon successfully created",
        data: {
          name: result.rows[0].name,
          icon: result.rows[0].icon,
          type: result.rows[0].type,
          color: result.rows[0].color,
        },
      });

      response.code(201);
    } else {
      response = h.response({
        code: 500,
        status: "Internal Server Error",
        message: "Icon failed to create",
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
module.exports = { uploadIcon };
