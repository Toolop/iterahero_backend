const mqtt = require("mqtt");
const sensor = require("../models/model-sensor");
const pool = require("../config/db");
const { getSensor } = require("../utils/sensor-utils");
const { getGreenHouse } = require("../utils/greenhouse-util");
const {
  getAutomation,
  isAutomationExistidSensor,
} = require("../utils/automation-utils");
const dotenv = require("dotenv");
const axios = require("axios");
const { getActuator } = require("../utils/actuator-util");

const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`;

const connectUrl = `ws://broker.hivemq.com:8000/mqtt`;

const subscribeSensor = async () => {
  try {
    dotenv.config();

    const client = mqtt.connect(connectUrl, {
      clientId,
      keepalive: 30,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      connectTimeout: 30 * 1000,
      rejectUnauthorized: false,

      //uncomment if need username or password
      //   username: 'emqx',
      //   password: 'public',
      reconnectPeriod: 1000,
    });
    const topic = "iterahero/sensor/#";
    client.on("connect", () => {
      console.log("Connected");
      client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
      });
    });

    client.on("message", async (topic, payload) => {
      try {
        let save = "";
        let getData = await JSON.parse(payload.toString());
        if (getData[0]) {
          for (const i in getData) {
            const sensorDB = await getSensor(getData[i].id_sensor);
            const id_user = await getGreenHouse(sensorDB.id_greenhouse);
            const formula = sensorDB.calibration;
            const x = parseFloat(getData[i].value);
            let value = 0;

            if (x > 0 && getData[i].status == "online") {
              if (formula) {
                value = await eval(formula).toFixed(2);
                if (value <= 0) {
                  value = 0;
                }
              } else {
                value = x;
              }

              const fix_sensor = await {
                id_sensor: getData[i].id_sensor,
                value: value,
                status: getData[i].status,
              };
              save = await sensor.create(fix_sensor);

              if (await isAutomationExistidSensor(getData[i].id_sensor)) {
                const list_automation = await getAutomation(
                  getData[i].id_sensor
                );
                if (list_automation) {
                  for (const auto in list_automation) {
                    if (list_automation[auto].automationStatus == "1") {
                      const actuatorDB = await getActuator(
                        list_automation[auto].id_actuator
                      );

                      if (
                        list_automation[auto].between == "<" &&
                        parseFloat(value) < sensorDB.range_min
                      ) {
                        if (
                          actuatorDB.status_lifecycle !=
                          list_automation[auto].status_lifecycle
                        ) {
                          axios.post(
                            "https://iterahero.fly.dev/api/v1/actuator-log",
                            {
                              id_actuator: list_automation[auto].id_actuator,
                              on_off_status:
                                list_automation[auto].status_lifecycle,
                            }
                          );
                        }
                      } else if (
                        list_automation[auto].between == ">" &&
                        parseFloat(value) > sensorDB.range_max
                      ) {
                        if (
                          actuatorDB.status_lifecycle !=
                          list_automation[auto].status_lifecycle
                        ) {
                          axios.post(
                            "https://iterahero.fly.dev/api/v1/actuator-log",
                            {
                              id_actuator: list_automation[auto].id_actuator,
                              on_off_status:
                                list_automation[auto].status_lifecycle,
                            }
                          );
                        }
                      } else if (
                        list_automation[auto].between == "<" &&
                        parseFloat(value) >
                          parseFloat(sensorDB.range_min) +
                            parseFloat(list_automation[auto].constanta)
                      ) {
                        if (list_automation[auto].status_lifecycle == "1") {
                          if (
                            actuatorDB.status_lifecycle ==
                            list_automation[auto].status_lifecycle
                          ) {
                            axios.post(
                              "https://iterahero.fly.dev/api/v1/actuator-log",
                              {
                                id_actuator: list_automation[auto].id_actuator,
                                on_off_status: "0",
                              }
                            );
                          }
                        }
                      } else if (
                        list_automation[auto].between == ">" &&
                        parseFloat(value) <
                          parseFloat(sensorDB.range_max) -
                            parseFloat(list_automation[auto].constanta)
                      ) {
                        if (list_automation[auto].status_lifecycle == "1") {
                          if (
                            actuatorDB.status_lifecycle ==
                            list_automation[auto].status_lifecycle
                          ) {
                            axios.post(
                              "https://iterahero.fly.dev/api/v1/actuator-log",
                              {
                                id_actuator: list_automation[auto].id_actuator,
                                on_off_status: "0",
                              }
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }

              // let type = "sensor";
              // let status = 0;
              // let detail = `Sensor ${sensorDB.name} pada greenhouse ${sensorDB.greenhouse} terjadi masalah`;
              // const created_at = new Date().toLocaleString("en-US", {
              //     timeZone: "Asia/Jakarta",
              // });

              // if(parseFloat(value) < sensorDB.range_min  || parseFloat(value) > sensorDB.range_max){
              //     if(sensorDB.notify === "0"){
              //         const getNotif =  pool.query(
              //             `INSERT INTO public."notification" (detail, created_at, type, status, id_sensor) VALUES($1,$2,$3,$4,$5) RETURNING *`,
              //             [detail, created_at, type, status, getData[i].id_sensor]
              //         );
              //          pool.query(
              //             `INSERT INTO public."receive" (id_user, id_notification) VALUES($1,$2) RETURNING *`,
              //             [id_user.id_user, getNotif.rows[0].id_notification]
              //         );
              //          pool.query(
              //             `UPDATE public."sensor" SET "notify"=1 WHERE id_sensor = $1`,
              //             [getData[i].id_sensor]
              //         );
              //     }
              // }else if(parseFloat(value) > sensorDB.range_min + 4  || parseFloat(value) < sensorDB.range_max - 4){
              //     if(sensorDB.notify === "1"){
              //          pool.query(
              //             'UPDATE public."sensor" SET "notify"=0 WHERE id_sensor = $1',
              //             [getData[i].id_sensor]
              //         );
              //     }
              // }
            } else if ((await getData[i].status) == "offline") {
              const fix_sensor = await {
                id_sensor: getData[i].id_sensor,
                value: 0,
                status: getData[i].status,
              };
              save = await sensor.create(fix_sensor);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { subscribeSensor };
