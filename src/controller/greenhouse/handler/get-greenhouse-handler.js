const pool = require("../../../config/db");
const { prisma } = require("../../../config/prisma");

const getGreenHouses = async (request, h) => {
  let { page, size } = request.query;
  let result;
  let response;
  const { id_user } = request.auth.credentials;

  try {
    page = page || 1;
    size = size || 10;
    const offset = (page - 1) * size;
    result = await prisma.greenhouse.findMany({
      where: {
        id_user,
      },
      skip: offset,
      take: size
    })

    // console.log(result.rows);
    response = h.response({
      code: 200,
      status: "OK",
      data: result
      // data: await Promise.all(
      //   result.rows.map(async (greenHouse) => ({
      //     id: greenHouse.id_greenhouse,
      //     name: greenHouse.name,
      //     image: greenHouse.image,
      //     location: greenHouse.location,
      //     created_at: greenHouse.created_at,
      //     user_id: greenHouse.id_user,
      //   }))
      // ),
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

module.exports = {
  getGreenHouses,
};
