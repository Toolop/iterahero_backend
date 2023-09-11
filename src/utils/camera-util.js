const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const isCameraExist = async (id) => {
  let isExist = false;

  try {
    const result = await prisma.camera.findUnique({
      where: {
        id_camera: id,
      },
    });

    if (result.rows[0]) {
      isExist = true;
    } else {
      isExist = false;
    }
  } catch (err) {
    console.log(err);
  }

  return isExist;
};

module.exports = {
  isCameraExist,
};
