const schedule = require("node-schedule");
const { publishData } = require("../config/mqtt");
const prisma = require("../config/prisma");

const initPeracikan = async () => {
  // Dijalankan ketika sistem pertama kali booting / starting
  schedule.gracefulShutdown()
    .then(async () => {
      const data = await prisma.penjadwalan.findMany({
        orderBy: {
          id: 'asc'
        }
      });
      data
        .filter((item) => item.isActive === true)
        .forEach((item) => {
          // Untuk setiap hari dalam penjadwalan, buat recurrence rule
          schedulePeracikan(item.id, item.waktu, item.hari, item.resepId)
        })
    })
    .catch((err) => console.log(err))
    .finally(async () => await prisma.$disconnect())
}

const onOffPeracikan = async (id) => {
  const data = await prisma.penjadwalan.findUnique({
    where: {
      id
    }
  })
  if (data) {
    if (data.isActive) {
      schedule.scheduledJobs[`iterahero2023-peracikan-${id}`].cancel()
    } else {
      schedulePeracikan(data.id, data.waktu, data.hari, data.resepId);
    }
  }
}

const deletePeracikan = (id) => {
  schedule.scheduledJobs[`iterahero2023-peracikan-${id}`].cancel()
}

const schedulePeracikan = async (id, jam, hari, resep) => {
  const waktu = jam.split(":");
  const hour = parseInt(waktu[0]);
  const minute = parseInt(waktu[1]);

  const rule = new schedule.RecurrenceRule();
  rule.hour = hour;
  rule.minute = minute;
  rule.dayOfWeek = hari;

  const komposisi = await prisma.resep.findUnique({
    where: {
      id: resep,
    },
  });
  if (komposisi) {
    schedule.scheduleJob(
      `iterahero2023-peracikan-${id}`,
      rule,
      function (resep) {
        console.log(`Schedule ${hour}:${waktu}`);
        publishData(
          "iterahero2023/peracikan",
          JSON.stringify({
            peracikan: true,
            komposisi: resep,
          })
        );
      }.bind(null, komposisi)
    );
  }
};

module.exports = { initPeracikan, deletePeracikan, onOffPeracikan, schedulePeracikan }