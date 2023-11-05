const { PrismaClient } = require("@prisma/client");
const dataIcon = require("./data/dataicon");
const dataCategory = require("./data/dataCategory");
const dataGreenhouse = require("./data/dataGreenhouse");
const dataSensor = require("./data/dataSensor");
const dataAutomation = require("./data/dataAutomation");
const dataActuator = require("./data/dataActuator");
const bcrypt = require("bcrypt");
const { getLocalISOString } = require("../src/utils/timestamp-utils");
const prisma = new PrismaClient();

async function main() {
  const date = getLocalISOString();
  const iconInsert = await prisma.icon.createMany({
    data: dataIcon,
    skipDuplicates: true, // Skip 'Bobo'
  });

  const categoryInsert = await prisma.category_sensor.createMany({
    data: dataCategory,
    skipDuplicates: true, // Skip 'Bobo'
  });
  const hashedPasswordAdmin = await bcrypt.hash("iterahero2022", 10);
  const hashedPasswordMitra = await bcrypt.hash("mitraiterahero", 10);

  const userInsert = await prisma.user.createMany({
    data: [
      {
        // id_user: 1,
        username: "iterahero2022",
        email: "iterahero2022@gmail.com",
        name: "iterahero",
        role: "admin",
        password: hashedPasswordAdmin,
        created_at: date,
        updated_at: date,
      },
      {
        // id_user: 2,
        username: "mitraiterahero",
        email: "mitraiterahero@gmail.com",
        name: "mitra",
        role: "operator",
        password: hashedPasswordMitra,
        created_at: date,
        updated_at: date,
      },
    ],
    skipDuplicates: true, // Skip 'Bobo'
  });
  const greenhouseInsert = await prisma.greenhouse.createMany({
    data: dataGreenhouse,
    skipDuplicates: true, // Skip 'Bobo'
  });
  const sensorInsert = await prisma.sensor.createMany({
    data: dataSensor,
    skipDuplicates: false, // Skip 'Bobo'
  });
  const actuatorInsert = await prisma.actuator.createMany({
    data: dataActuator,
    skipDuplicates: false, // Skip 'Bobo'
  });
  const automationInsert = await prisma.automation.createMany({
    data: dataAutomation,
    skipDuplicates: false, // Skip 'Bobo'
  });
  const tandon = await prisma.tandon.createMany({
    data: [
      {
        nama: "Tandon Peracikan - Kebun Raya",
        userId: 1,
        isOnline: true,
        status: "Idle",
        rasioA: 5,
        rasioB: 5,
        rasioAir: 1000,
        ppm: 1500
      },
      {
        nama: "Tandon Peracikan - Mitra",
        userId: 2,
        isOnline: true,
        status: "Idle",
        rasioA: 5,
        rasioB: 5,
        rasioAir: 1000,
        ppm: 1500
      },
    ]
  });
  const tandonBahan = await prisma.tandonBahan.createMany({
    data: [
      {
        nama: "Nutrisi A",
        tandonId: 1,
      },
      {
        nama: "Nutrisi B",
        tandonId: 1,
      },
      {
        nama: "Air",
        tandonId: 1,
      },
      {
        nama: "Asam",
        tandonId: 1,
      },
      {
        nama: "Basa",
        tandonId: 1,
      },
    ],
  });
  const resep = await prisma.resep.create({
    data: {
      nama: "melon",
      ppm: 1000,
      ph: 7.2,
      interval: 120,
      durasi: 10
    },
  });
  const sensor = await prisma.sensor.createMany({
    data: [
      {
        name: "Sensor Ketinggian",
        brand: "Adidas",
        unit_measurement: "m",
        icon: "",
        color: "#319795",
        range_min: 0,
        range_max: 30,
        id_category_sensor: 3,
        id_greenhouse: 1,
        calibration: "y = mx + b",
        notify: 0,
        id_tandon: 1,
      },
      {
        name: "Sensor Ketinggian",
        brand: "Adidas",
        unit_measurement: "m",
        icon: "",
        color: "#319795",
        range_min: 0,
        range_max: 30,
        id_category_sensor: 3,
        id_greenhouse: 1,
        calibration: "y = mx + b",
        notify: 0,
        id_tandon_bahan: 1,
      },
      {
        name: "Sensor Ketinggian",
        brand: "Adidas",
        unit_measurement: "m",
        icon: "",
        color: "#319795",
        range_min: 0,
        range_max: 30,
        id_category_sensor: 3,
        id_greenhouse: 1,
        calibration: "y = mx + b",
        notify: 0,
        id_tandon_bahan: 2,
      },
      {
        name: "Sensor Ketinggian",
        brand: "Adidas",
        unit_measurement: "m",
        icon: "",
        color: "#319795",
        range_min: 0,
        range_max: 30,
        id_category_sensor: 3,
        id_greenhouse: 1,
        calibration: "y = mx + b",
        notify: 0,
        id_tandon_bahan: 3,
      },
      {
        name: "Sensor Ketinggian",
        brand: "Adidas",
        unit_measurement: "m",
        icon: "",
        color: "#319795",
        range_min: 0,
        range_max: 30,
        id_category_sensor: 3,
        id_greenhouse: 1,
        calibration: "y = mx + b",
        notify: 0,
        id_tandon_bahan: 4,
      },
      {
        name: "Sensor Ketinggian",
        brand: "Adidas",
        unit_measurement: "m",
        icon: "",
        color: "#319795",
        range_min: 0,
        range_max: 30,
        id_category_sensor: 3,
        id_greenhouse: 1,
        calibration: "y = mx + b",
        notify: 0,
        id_tandon_bahan: 4,
      },
    ],
  });
  console.log({ resep, tandon, tandonBahan, sensor });

  console.log({
    iconInsert,
    categoryInsert,
    userInsert,
    greenhouseInsert,
    sensorInsert,
    actuatorInsert,
    automationInsert,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
