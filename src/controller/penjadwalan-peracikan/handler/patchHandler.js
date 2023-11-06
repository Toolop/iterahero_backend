const Boom = require("@hapi/boom");
const prisma = require("../../../config/prisma");
const { schedulePeracikan, onOffPeracikan } = require("../../../utils/penjadwalan-util");

const patchHandler = async (request, h) => {
    try {
        const { id } = request.payload;
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

        onOffPeracikan(targetWaktu.id);

        return h.response({
            status: 'success',
            message: `Penjadwalan berhasil di-${targetWaktu.isActive ? 'nonaktifkan' : 'aktifkan'}`
        }).code(204);
    }
    catch (e) {
        console.log(e)
        if (e instanceof Error) {
            return Boom.internal(e.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = { patchHandler }