const { Boom } = require("@hapi/boom");
const prisma = require("../../../config/prisma");
const { schedulePeracikan } = require("../../../utils/penjadwalan-util");

const patchHandler = async (request, h) => {
    try {
        const { id } = request.query;
        const targetWaktu = await prisma.penjadwalan.findUnique({
            where: { id },
        });

        if (targetWaktu) {
            await prisma.penjadwalan.update({
                where: { id },
                data: {
                    isActive: !targetWaktu.isActive
                }
            })
        } else {
            return Boom.notFound("Penjadwalan terpilih tidak ditemukan");
        }

        const data = await prisma.penjadwalan.findMany({
            where: {
                isActive: true
            }
        });
        const jadwal = data.map(item => item.waktu);
        schedulePeracikan(jadwal);

        return h.response({
            status: 'success',
            message: 'Penjadwalan berhasil di-nonaktifkan'
        }).code(204);
    }
    catch (e) {
        if (e instanceof Error) {
            return Boom.internal(e.message);
        }
    } finally {
        prisma.$disconnect();
    }
}

module.exports = { patchHandler }