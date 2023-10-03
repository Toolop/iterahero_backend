const Boom = require("@hapi/boom");
const prisma = require("../../../config/prisma");
const { schedulePeracikan } = require("../../../utils/penjadwalan-util");
const { publishData } = require("../../../config/mqtt");

const postHandler = async (request, h) => {
  try {
    const { resep, id_tandon, waktu, iterasi, interval } = request.payload;
    const _splitTime = waktu.split(":");
    const jam = parseInt(_splitTime[0]);
    const menit = parseInt(_splitTime[1]);
    const isAuth = request.auth.credentials;

    if (isAuth) {
      const resepTarget = await prisma.resep.findFirst({
        where: {
          nama: resep,
        },
      });

      if (!resepTarget) {
        return Boom.notFound("Tidak ada resep yang sesuai");
      }

      const arrJam = [{ hour: jam, minute: menit }];
      const arrValidasi = [`${jam}:${menit}`];

      for (let i = 0; i < iterasi - 1; i++) {
        const intervalJam = Math.floor(resepTarget.interval / 60);
        const intervalMenit = resepTarget.interval % 60;
        let jamJadwal = jam + intervalJam * (i + 1);
        let menitJadwal = menit + intervalMenit * (i + 1);
        jamJadwal += Math.floor(menitJadwal / 60);
        menitJadwal %= 60;
        arrValidasi.push(
          `${jamJadwal}:${menitJadwal < 10 ? "0" + menitJadwal : menitJadwal}`
        );
        arrJam.push({ hour: jamJadwal, minute: menitJadwal });
      }

      const isJadwalExist = await prisma.penjadwalan.findFirst({
        where: {
          waktu: {
            in: arrValidasi,
          },
        },
      });

      if (isJadwalExist) {
        return Boom.badRequest(
          `Sudah ada peracikan di jam ${isJadwalExist.waktu}`
        );
      }

      arrValidasi.forEach(async (item, index) => {
        await prisma.penjadwalan.create({
          data: {
            resepId: resepTarget.id,
            waktu: item,
            tandonId: id_tandon,
            isActive: true,
          },
        });
      });

      schedulePeracikan(arrValidasi);
      publishData("iterahero2023/peracikan", `{ data: ${arrValidasi}} }`);

      return h
        .response({
          status: "success",
          message: "Penjadwalan telah dibuat",
        })
        .code(201);
    }
  } catch (e) {
    if (e instanceof Error) {
      return Boom.internal(e.message);
    }
  } finally {
    prisma.$disconnect();
  }
};

module.exports = { postHandler };
