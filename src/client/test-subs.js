const mqtt = require("mqtt");
const pool = require("../config/db");
const sensor = require("../models/model-sensor");
const { getSensor } = require("../utils/sensor-utils");
const { getGreenHouse } = require("../utils/greenhouse-util");

const host = "broker.hivemq.com";
const port = "1883";
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

const subscribeSensor = () => {
  try {
    const client = mqtt.connect(connectUrl, {
      clientId,
      keepalive: 30,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: false,
      connectTimeout: 30 * 1000,
      rejectUnauthorized: false,

      //uncomment if need username or password
      //   username: 'emqx',
      //   password: 'public',
      reconnectPeriod: 1000,
    });
    const topic = "iterahero/test";

    client.on("connect", () => {
      console.log("Connected");
      setInterval(function () {
        let message = [
          {
            value: Math.floor(Math.random() * 10 + 30),
            id_sensor: 2,
            status: "online",
          },
          {
            value: Math.floor(Math.random() * 10 + 70),
            id_sensor: 3,
            status: "online",
          },
          {
            value: Math.floor(Math.random() * 10 + 100),
            id_sensor: 4,
            status: "online",
          },
        ];
        client.publish(
          topic,
          JSON.stringify(message),
          { qos: 1, retain: false },
          async (error) => {
            if (error) {
              console.error(error);
            }
          }
        );
      }, 1000);
    });
  } catch (err) {
    console.log(err);
  }
};

subscribeSensor();
