const Boom = require("@hapi/boom");
const prisma = require("../../../config/prisma");

const getHandler = async (request, h) => {
  try {
    const data = await prisma.penjadwalan.findMany({
      include: {
        resep: true,
      },
    });

    if (!data) {
      return Boom.notFound("Tidak ada data penjadwalan");
    }
    return h
      .response({
        status: "success",
        data,
      })
      .code(200);
  } catch (e) {
    if (e instanceof Error) {
      return Boom.internal(e.message);
    }
  } finally {
    prisma.$disconnect();
  }
};

module.exports = { getHandler };
