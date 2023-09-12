const pool = require("../../../config/db");

const addCameraByGreenhouseId = async (request, h) => {
  let response;

  const { id_greenhouse, name } = request.payload;

  try {
    await pool.query(
      `INSERT INTO public.camera (id_greenhouse, name) VALUES ($1, $2);`,
      [id_greenhouse, name]
    );
    response = h
      .response({
        status: "success",
        message: `kamera dengan nama ${name} berhasil ditambahkan`,
      })
      .code(201);
  } catch (e) {
    response = h
      .response({
        status: "error",
        message: e,
      })
      .code(400);
  }
  return response;
};

module.exports = {
  addCameraByGreenhouseId,
};
