const Boom = require("@hapi/boom");
const prisma = require("../../../config/prisma");
const { initPeracikan } = require("../../../utils/penjadwalan-util");

const postHandler = async (request, h) => {
    try {
        const { resep, id_tandon, waktu, iterasi, hari, durasi } = request.payload
        const _splitTime = waktu.split(":");
        const jam = parseInt(_splitTime[0]);
        const menit = parseInt(_splitTime[1]);
        const resepTarget = await prisma.resep.findFirst({
            where: {
                nama: resep
            }
        })

        const arrJam = [{hour: jam, minute: menit}];
        const arrValidasi = [`${jam < 10 ? '0' + jam : jam}:${menit < 10 ? '0' + menit : menit}`]

        for (let i = 0; i < iterasi-1; i++) {
            const intervalJam = Math.floor(resepTarget.interval / 60);
            const intervalMenit = resepTarget.interval % 60;
            let jamJadwal = jam + intervalJam * (i + 1);
            let menitJadwal = menit + intervalMenit * (i + 1);
            jamJadwal += Math.floor(menitJadwal / 60);
            menitJadwal %= 60;
            if (jamJadwal > 24) {
                return Boom.badRequest("Peracikan dengan skema tersebut tidak dapat dilakukan.")
            }
            arrValidasi.push(`${jamJadwal < 10 ? '0' + jamJadwal : jamJadwal}:${menitJadwal < 10 ? '0' + menitJadwal : menitJadwal}`);
            arrJam.push({ hour: jamJadwal % 24, minute: menitJadwal })
        }

        const isJadwalExist = await prisma.penjadwalan.findFirst({
            where: {
                waktu: {
                    in: arrValidasi
                },
                hari: {
                    hasSome: hari
                },
                tandonId: {
                    equals: id_tandon
                }
            }
        });

        if (isJadwalExist) {
            const error = Boom.badRequest(`Sudah ada peracikan di jam ${isJadwalExist.waktu}`)
            error.output.payload.data = { status: isJadwalExist.isActive ? 'enabled' : 'disabled', hari}
            return error;
        }

        arrValidasi.forEach(async (item, index) => {
            await prisma.penjadwalan.create({
                data: {
                    resepId: resepTarget.id,
                    waktu: item,
                    tandonId: id_tandon,
                    isActive: true,
                    hari,
                    durasi
                }
            })
        });

        initPeracikan();
        
        return h.response({
            status: 'success',
            message: 'Penjadwalan telah dibuat'
        }).code(201);
    }
    catch (e) {
        console.log(e)
        if (e instanceof Error) {
            return Boom.internal(e.message)
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

module.exports = { postHandler }