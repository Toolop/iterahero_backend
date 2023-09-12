const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const isCameraExist = async (id) => {
  let isExist = false;

  try {
    const result = await prisma.camera.findMany({
      where: {
        id_camera: parseInt(id),
      },
    });
    if (result[0].id_camera) {
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
