const mqtt = require('mqtt')
const sensor = require('../models/model-sensor');

const host = 'broker.hivemq.com'
const port = '1883'
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`;

const subscribeSensor = () =>{
    try{
            const client = mqtt.connect(connectUrl, {
                clientId,
                keepalive: 30,
                protocolId: 'MQTT',
                protocolVersion: 4,
                clean: true,
                connectTimeout: 30 * 1000,
                rejectUnauthorized: false,
                    
                    //uncomment if need username or password
                    //   username: 'emqx',
                    //   password: 'public',
                reconnectPeriod: 1000,
            });
            const topic = "iterahero/sensor/#"
            client.on('connect', () => {
                console.log('Connected')
                client.subscribe([topic], () => {
                    console.log(`Subscribe to topic '${topic}'`)
                })
            })

            client.on('message', async(topic, payload) => {
                try{
                    let getData = await JSON.parse((payload.toString()));
                    let save = await sensor.insertMany(getData);
                    const sensor = await  getSensor(sensorId);
                    const id_user = await ( getGreenHouse(sensor.id_greenhouse)).id_user;

                    let detail = `Sensor ${sensor.name} pada greenhouse ${sensor.greenhouse} terjadi masalah`;
                    const created_at = new Date().toLocaleString("en-US", {
                        timeZone: "Asia/Jakarta",
                    });
                    
                    if(value < sensor.range_min  && value > sensor.range_max){
                        if(sensor.notify == 0){
                            const getNotif = await pool.query(
                                `INSERT INTO public."notification" (detail, created_at, type, status, id_actuator) VALUES($1,$2,$3,$4,$5) RETURNING *`,
                                [detail, created_at, type, status, id_actuator]
                            );
                    
                            await pool.query(
                                `INSERT INTO public."receive" (id_user, id_notification) VALUES($1,$2) RETURNING *`,
                                [id_user, getNotif.rows[0].id_notification]
                            );
                            await pool.query(
                                'UPDATE public."sensor" SET "notify"=1, WHERE id_sensor = $1',
                                [sensorId]
                            );
                        }
                    }else{
                        if(sensor.notify == 1){
                            await pool.query(
                                'UPDATE public."sensor" SET "notify"=0, WHERE id_sensor = $1',
                                [sensorId]
                            );
                        }
                    }
    
                    if(save){
                        console.log('berhasil');
                    }else{
                        console.log('failure');
                    }   

                }catch(err){
                    console.log(err);
                }
            });
            
    }catch(err){
        console.log(err);
    }
}

module.exports = {subscribeSensor};