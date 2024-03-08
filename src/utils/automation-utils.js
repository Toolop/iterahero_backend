const pool = require("../config/db");
const { prisma } = require("../config/prisma");

const getAutomation = async (id) => {
  let automation = {};

  try {
    const result = await pool.query(
      'SELECT "automation".*,"actuator".automation as "automationStatus" FROM public."automation" join public."actuator" on "automation".id_actuator = "actuator".id_actuator WHERE id_sensor=$1',
      [id]
    );

    if (result.rows[0]) {
      automation = Promise.all(
        result.rows.map(async (automation) => ({
          id_actuator: automation.id_actuator,
          id_sensor: automation.id_sensor,
          condition: automation.condition,
          status_lifecycle: automation.status_lifecycle,
          created_at: automation.created_at,
          constanta: automation.constanta,
          id_automation: automation.id_automation,
          automationStatus: automation.automationStatus,
        }))
      );
    }
  } catch (err) {
    console.log(err);
  }

  return automation;
};

const isAutomationExistidSensor = async (id) => {
  let isExist = false;

  try {
    const result = await pool.query(
      'SELECT * FROM public."automation" WHERE id_sensor = $1',
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

const isAutomationExist = async (id) => {
  let isExist = false;

  try {
    const res = await prisma.automation.count({
      where: {
        id_automation: parseInt(id)
      }
    })
    // const result = await pool.query(
    //   'SELECT * FROM public."automation" WHERE id_automation = $1',
    //   [id]
    // );

    if (res > 0) {
      isExist = true;
    } else {
      isExist = false;
    }
  } catch (err) {
    console.log(err);
  }

  return isExist;
};
const getNameSensorByID = async (id) => {
  let sensor = {};

  try {
    const result = await pool.query(
      'SELECT * FROM public."sensor" WHERE id_sensor = $1',
      [id]
    );

    if (result.rows[0]) {
      sensor = {
        id: result.rows[0].id_sensor,
        name: result.rows[0].name,
      };
    }
  } catch (err) {
    console.log(err);
  }

  return sensor;
};
module.exports = {
  getAutomation,
  isAutomationExistidSensor,
  isAutomationExist,
};
