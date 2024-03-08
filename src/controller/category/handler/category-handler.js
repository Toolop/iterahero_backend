const pool = require("../../../config/db");
const { prisma } = require('../../../config/prisma');

const uploadCategorySensor = async (request, h) => {
  const { name, icon, color, type } = request.payload;

  let response = "";

  try {
    const result = await prisma.category.create({
      data: {
        nama: name,
        icon,
        color,
        type,
      }
    });

    if (result) {
      response = h.response({
        code: 201,
        status: "Created",
        message: "Sensor successfully created",
        data: {
          id: result.id,
          name: result.nama,
        },
      });

      response.code(201);
    } else {
      response = h.response({
        code: 500,
        status: "Internal Server Error",
        message: "Sensor failed to create",
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

const getCategorySensor = async (request, h) => {
  let result;
  let response;

  try {
    result = await prisma.category.findMany({});

    response = h.response({
      code: 200,
      status: "OK",
      data: result.map(item => {
        const { created_at, updated_at, ...filteredItem } = item;
        return filteredItem
      }),
    }).code(200);
  } catch (err) {
    response = h.response({
      code: 400,
      status: "Bad Request",
      message: "error",
    }).code(400);

    console.log(err);
  }

  return response;
};

module.exports = { uploadCategorySensor, getCategorySensor };
