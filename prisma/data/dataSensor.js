const { getLocalISOString } = require("../../src/utils/timestamp-utils");

const date = getLocalISOString();
const dataSensor = [
  {
    // id_sensor: 1,
    name: "Suhu Lingkungan 1",
    unit_measurement: "Celcius",
    brand: "SHT20",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666447016/itera%20herro%20icon/Icon%20fix/Monitoring/Temperatur_lingkungan_v5zd9b.png",
    color: "#1775BB",
    range_min: 27,
    range_max: 30,
    id_category_sensor: 2,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x",
    notify: 0,
  },
  {
    // id_sensor: 2,
    name: "Kelembapan Udara 1",
    unit_measurement: "%",
    brand: "SHT20",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666447111/itera%20herro%20icon/Icon%20fix/Monitoring/RH_kdyzoe.png",
    color: "#B0D0F8",
    range_min: 70,
    range_max: 80,
    id_category_sensor: 1,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "0.7222*x+18.518",
    notify: 0,
  },
  {
    // id_sensor: 3,
    name: "Sensor Cahaya",
    unit_measurement: "LUX",
    brand: "Matahari",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666445788/itera%20herro%20icon/Icon%20fix/Monitoring/sun_ygpono.png",
    color: "#B7A925",
    range_min: 1,
    range_max: 100000,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "0.5053*x+4061",
    notify: 0,
  },
  {
    // id_sensor: 4,
    name: "PH Nutrisi",
    unit_measurement: "pH",
    brand: "defrobot",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666445910/itera%20herro%20icon/Icon%20fix/Monitoring/ph_ykaxmx.png",
    color: "#1775BB",
    range_min: 6,
    range_max: 8,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x",
    notify: 0,
  },
  {
    // id_sensor: 5,
    name: "EC Nutrisi",
    unit_measurement: "mS/cm",
    brand: "DFROBOT",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666447439/itera%20herro%20icon/Icon%20fix/Monitoring/EC_jlfi3p.png",
    color: "#E94F66",
    range_min: 250,
    range_max: 750,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x",
    notify: 0,
  },
  {
    // id_sensor: 6,
    name: "Suhu Nutrisi",
    unit_measurement: "Celcius",
    brand: "Termistor",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666447292/itera%20herro%20icon/Icon%20fix/Monitoring/Temperature_Nutrisi_xfvpre.png",
    color: "#319795",
    range_min: 25,
    range_max: 30,
    id_category_sensor: 2,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x",
    notify: 0,
  },
  {
    // id_sensor: 7,
    name: "Volume Aliran Utama",
    unit_measurement: "ml",
    brand: "YSVS",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666446196/itera%20herro%20icon/Icon%20fix/Monitoring/Debit_hsfilu.png",
    color: "#319795",
    range_min: 1,
    range_max: 100000,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x*1000+750",
    notify: 0,
  },
  {
    // id_sensor: 8,
    name: "Volume Nutrisi Line 1",
    unit_measurement: "ml",
    brand: "YSVS",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666446196/itera%20herro%20icon/Icon%20fix/Monitoring/Debit_hsfilu.png",
    color: "#319795",
    range_min: 1,
    range_max: 5040,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x*1000-140",
    notify: 0,
  },
  {
    // id_sensor: 9,
    name: "Volume Nutrisi Line 2",
    unit_measurement: "ml",
    brand: "YSVS",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666446196/itera%20herro%20icon/Icon%20fix/Monitoring/Debit_hsfilu.png",
    color: "#319795",
    range_min: 1,
    range_max: 5040,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x*1000-145",
    notify: 0,
  },
  {
    // id_sensor: 10,
    name: "Volume Nutrisi Line 3",
    unit_measurement: "ml",
    brand: "YSVS",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666446196/itera%20herro%20icon/Icon%20fix/Monitoring/Debit_hsfilu.png",
    color: "#319795",
    range_min: 1,
    range_max: 6720,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x*1000-87",
    notify: 0,
  },
  {
    // id_sensor: 11,
    name: "Volume Nutrisi Line 4",
    unit_measurement: "ml",
    brand: "YSVS",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666446196/itera%20herro%20icon/Icon%20fix/Monitoring/Debit_hsfilu.png",
    color: "#319795",
    range_min: 1,
    range_max: 6720,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x*1000-141",
    notify: 0,
  },
  {
    // id_sensor: 14,
    name: "Sensor Suhu Lingkungan 2",
    unit_measurement: "Celcius",
    brand: "SHT 20",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666447016/itera%20herro%20icon/Icon%20fix/Monitoring/Temperatur_lingkungan_v5zd9b.png",
    color: "#1775BB",
    range_min: 22,
    range_max: 30,
    id_category_sensor: 2,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x",
    notify: 0,
  },
  {
    // id_sensor: 15,
    name: "Kelembapan Udara 2 ",
    unit_measurement: "%",
    brand: "SHT20",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666447111/itera%20herro%20icon/Icon%20fix/Monitoring/RH_kdyzoe.png",
    color: "#B0D0F8",
    range_min: 70,
    range_max: 80,
    id_category_sensor: 1,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "0.6309*x+29.001",
    notify: 0,
  },
  {
    // id_sensor: 16,
    name: "Sensor Cahaya 2",
    unit_measurement: "LUX",
    brand: "Matahari",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666445788/itera%20herro%20icon/Icon%20fix/Monitoring/sun_ygpono.png",
    color: "#B7A925",
    range_min: 1,
    range_max: 100000,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "0.192*x+4911.9",
    notify: 0,
  },
  {
    // id_sensor: 17,
    name: "Sensor Suhu Lingkungan 3",
    unit_measurement: "Celcius",
    brand: "SHT 20",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666447016/itera%20herro%20icon/Icon%20fix/Monitoring/Temperatur_lingkungan_v5zd9b.png",
    color: "#1775BB",
    range_min: 20,
    range_max: 39,
    id_category_sensor: 2,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "0.8775*x+6.1974",
    notify: 0,
  },
  {
    // id_sensor: 18,
    name: "Kelembapan Udara 3",
    unit_measurement: "%",
    brand: "SHT 20",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666447111/itera%20herro%20icon/Icon%20fix/Monitoring/RH_kdyzoe.png",
    color: "#B0D0F8",
    range_min: 70,
    range_max: 95,
    id_category_sensor: 1,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "0.4852*x+38.633",
    notify: 0,
  },
  {
    // id_sensor: 19,
    name: "Sensor Cahaya 3",
    unit_measurement: "LUX",
    brand: "Matahari",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666445788/itera%20herro%20icon/Icon%20fix/Monitoring/sun_ygpono.png",
    color: "#B7A925",
    range_min: 4000,
    range_max: 14000,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "1.1417*x-2101.5",
    notify: 0,
  },
  {
    // id_sensor: 20,
    name: "Kadar PPM Nutrisi",
    unit_measurement: "ppm",
    brand: "DFRobot",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666447500/itera%20herro%20icon/Icon%20fix/Monitoring/tds_k0gvaf.png",
    color: "#FFB801",
    range_min: 1,
    range_max: 1600,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x",
    notify: 0,
  },
  {
    // id_sensor: 21,
    name: "Suhu Nutrisi Peracikan",
    unit_measurement: "Celcius",
    brand: "DS18B20",
    icon: "https://res.cloudinary.com/diyu8lkwy/image/upload/v1666447292/itera%20herro%20icon/Icon%20fix/Monitoring/Temperature_Nutrisi_xfvpre.png",
    color: "#319795",
    range_min: 20,
    range_max: 60,
    id_category_sensor: 3,
    created_at: date,
    updated_at: date,
    id_greenhouse: 1,
    calibration: "x",
    notify: 0,
  },
];

module.exports = dataSensor;
