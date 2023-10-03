const prisma = require("../../../config/prisma");

const postHandler = async (request, h) => {
  let response;
  const { nama, ppm, ph } = request.payload;

  try {
    await prisma.peracikan.create({
      data: {
        nama,
        ppm: parseInt(ppm),
        ph: parseFloat(ph),
      },
    });
    response = h
      .response({
        status: "success",
        message: "Peracikan dimulai",
        // message: `Resep ${nama} dengan PPM = ${ppm} dan pH = ${ph} berhasil ditambahkan`
      })
      .code(200);
  } catch (e) {
    response = h
      .response({
        status: "failed",
        message: e,
      })
      .code(500);
    console.log(e);
  }
  prisma.$disconnect();
  return response;
};

module.exports = postHandler;
