const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(), 
current.getMonth(),current.getDate(),current.getHours(), 
current.getMinutes(),current.getSeconds(), current.getMilliseconds()));


const sensorSchema = new Schema({
    value: Number,
    id_sensor: Number,
    createdAt:{ type: Date, default : timeStamp }
});

module.exports = mongoose.model('sensor', sensorSchema);
