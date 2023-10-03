const Boom = require("@hapi/boom");
const prisma = require("../../../config/prisma");
const { schedulePeracikan } = require("../../../utils/penjadwalan-util");

const deleteHandler = async (request, h) => {
    try {
        const { id } = request.query;

        await prisma.penjadwalan.delete({
            where: {
                id
            },
        });

        const data = await prisma.penjadwalan.findMany();
        const jadwal = data.map(item => item.waktu);
        schedulePeracikan(jadwal);

        return h.response({
            status: 'success',
            message: 'Penjadwalan berhasil dihapus'
        }).code(200)
    }
    catch (e) {
        if (e instanceof Error) {
            return Boom.notFound("Tidak ada penjadwalan dengan id tersebut")
        }
    } finally {
        prisma.$disconnect();
    }
}

module.exports = { deleteHandler }