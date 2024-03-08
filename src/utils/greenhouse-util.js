const pool = require("../config/db");
const { prisma } = require("../config/prisma");
const { deleteImage, pathImage } = require("./cloudinary");

const getGreenHouse = async (id) => {
  let greenhouse = {};

  try {
    const result = await pool.query(
      'SELECT * FROM public."greenhouse" WHERE id_greenhouse=$1',
      [id]
    );

    if (result.rows[0]) {
      const greenhouseData = result.rows[0];
      greenhouse = {
        id: greenhouseData.id_greenhouse,
        name: greenhouseData.name,
        location: greenhouseData.location,
        id_user: greenhouseData.id_user,
      };
    }
  } catch (err) {
    console.log(err);
  }

  return greenhouse;
};

const getGreenHouseName = async (id) => {
  let name;

  try {
    const result = await pool.query(
      'SELECT * FROM public."greenhouse" WHERE id_greenhouse=$1',
      [id]
    );

    if (result.rows[0]) {
      const greenhouseData = result.rows[0];
      name = greenhouseData.name;
    }
  } catch (err) {
    console.log(err);
  }

  return name;
};

const isGreenhouseExist = async (id) => {
  let isExist = false;

  try {
    const result = await prisma.greenhouse.count({
      where: {
        id_greenhouse: parseInt(id)
      }
    });

    if (result) {
      isExist = true;
    } else {
      isExist = false;
    }
  } catch (err) {
    console.log(err);
  }

  return isExist;
};

const deletimageGreenhouse = async (id) => {
  let old_image = "";

  try {
    old_image = await prisma.greenhouse.findUnique({
      where: {
        id_greenhouse: parseInt(id)
      }
    })

    let publicId = await pathImage(old_image.image);
    await deleteImage(publicId);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getGreenHouse,
  isGreenhouseExist,
  deletimageGreenhouse,
  getGreenHouseName,
};
