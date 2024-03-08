const { PrismaClient } = require("@prisma/client");
const dataIcon = require("./data/dataicon");
const { dataActuator } = require("./data/dataActuator");
const { dataAutomation } = require("./data/dataAutomation");
const { dataGreenhouse } = require("./data/dataGreenhouse");
const { dataSensor } = require("./data/dataSensor");
const bcrypt = require("bcrypt");
const { dataCategory } = require("./data/dataCategory");
const prisma = new PrismaClient();

async function main() {

  const categoryInsert = await prisma.category.createMany({
    data: dataCategory,
    skipDuplicates: true, // Skip 'Bobo'
  });
  
  const hashedPasswordAdmin = await bcrypt.hash("iterahero2022", 10);
  const hashedPasswordMitra = await bcrypt.hash("mitraiterahero", 10);

  const userInsert = await prisma.user.createMany({
    data: [
      {
        username: "iterahero2022",
        email: "iterahero2022@gmail.com",
        name: "iterahero",
        role: "admin",
        password: hashedPasswordAdmin,
      },
      {
        username: "mitraiterahero",
        email: "mitraiterahero@gmail.com",
        name: "mitra",
        role: "operator",
        password: hashedPasswordMitra,
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

  const tandon = await prisma.tandon.create({
    data: {
      nama: "Tandon Peracikan",
      userId: 1,
      status: "Idle",
    },
  });

  const resep = await prisma.resep.create({
    data: {
      nama: "melon",
      ph_min: 6.4,
      ph_max: 7.0,
      ppm_min: 1200,
      ppm_max: 1400,
      volume: 800
    },
  });

  console.log({ resep, tandon });

  console.log({
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
