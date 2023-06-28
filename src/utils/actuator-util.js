const pool = require("../config/db");
const { pathImage, deleteImage } = require("./cloudinary");
const { getGreenHouse } = require("./greenhouse-util");

const getActuator = async (id) => {
  let actuator = {};

  try {
    const result = await pool.query(
      'SELECT * FROM public."actuator" WHERE id_actuator=$1',
      [id]
    );

    if (result.rows[0]) {
      const actuatorData = result.rows[0];
      actuator = {
        id: actuatorData.id_actuator,
        name: actuatorData.name,
        status_lifecycle: actuatorData.status_lifecycle,
        id_greenhouse: actuatorData.id_greenhouse,
        greenhouse_loc: (await getGreenHouse(actuatorData.id_greenhouse))
          .location,
        automation: actuatorData.automation,
        detailact: result.rows[0].detailact,
        actuator_image: result.rows[0].actuator_image,
        posisitionact: result.rows[0].posisitionact,
      };
    }
  } catch (err) {
    console.log(err);
  }

  return actuator;
};

const isActuatorExist = async (id) => {
  let isExist = [];

  try {
    const result = await pool.query(
      'SELECT * FROM public."actuator" WHERE id_actuator = $1',
      [id]
    );

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
const getNameActuatorByID = async (id) => {
  let sensor = {};

  try {
    const result = await pool.query(
      'SELECT * FROM public."actuator" WHERE id_actuator = $1',
      [id]
    );

    if (result.rows[0]) {
      sensor = {
        id: result.rows[0].id_actuator,
        name: result.rows[0].name,
        automation_status: result.rows[0].automation,
      };
    }
  } catch (err) {
    console.log(err);
  }

  return sensor;
};
const deletimagePosistionAct = async (id) => {
  let old_image = "";

  try {
    old_image = await pool.query(
      'SELECT posisitionact from public."actuator" WHERE id_actuator=$1',
      [id]
    );

    let publicId = await pathImage(old_image.rows[0].posisitionact);
    await deleteImage(publicId);
  } catch (err) {
    console.log(err);
  }
};

const deletimageActuator = async (id) => {
  let old_image = "";

  try {
    old_image = await pool.query(
      'SELECT actuator_image from public."actuator" WHERE id_actuator=$1',
      [id]
    );

    let publicId = await pathImage(old_image.rows[0].actuator_image);
    await deleteImage(publicId);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getActuator,
  isActuatorExist,
  getNameActuatorByID,
  deletimagePosistionAct,
  deletimageActuator,
};
