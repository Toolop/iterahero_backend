const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sensorSchema = new Schema({
    value: Number,
    id_sensor: Number,
    status: String,
},{ timestamps: true });

module.exports = mongoose.model('sensor', sensorSchema);
