const { Query } = require("mongoose");
const modelCamera = require("../../../models/model-camera");

const getCameraBroker = async (request, h) => {
  const { id_camera } = request.query;
  let response = "";

  try {
    const result = await modelCamera
      .find({ id_camera: id_camera })
      .sort({ createdAt: -1 })
      .limit(1);

    if (result) {
      response = h.response({
        code: 200,
        status: "Ok",
        data: result,
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

module.exports = { getCameraBroker };
