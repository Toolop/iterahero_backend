
const mqtt = require('mqtt')
const pool = require("../config/db");
const { getLocalISOString }  = require("../utils/timestamp-utils");

const host = 'broker.hivemq.com'
const port = '1883'
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`;
const responActuator = async() =>{
    try{
            const client = mqtt.connect(connectUrl, {
                clientId,
                keepalive: 30,
                protocolId: 'MQTT',
                protocolVersion: 4,
                clean: true,
                connectTimeout: 30 * 1000,
                rejectUnauthorized: false,
                reconnectPeriod: 1000,
            });
            const subtopic = `iterahero/respon/actuator/#`;
            await client.on('connect', () => {
                console.log('Connected')
                client.subscribe([subtopic], () => {
                    console.log(`Subscribe to topic '${subtopic}'`)
                });
            });

            await client.on('message', async(topic, payload) => {
                getDataBroker = payload.toString();
                var n = topic.lastIndexOf('/');
                var id_actuator = topic.substring(n + 1);
                const created_at = getLocalISOString();
                await pool.query(
                    `INSERT INTO public."actuator_log" (id_actuator, on_off_status, created_at) VALUES($1,$2,$3) RETURNING *`,
                    [id_actuator,getDataBroker, created_at]
                );
                await pool.query(
                    `UPDATE public."actuator" SET "status_lifecycle"=$1 WHERE id_actuator = $2`,
                    [getDataBroker, id_actuator]
                );
            });         

    }catch(err){
        console.log(err);
    }
}

module.exports = {responActuator};