const Boom = require("@hapi/boom");
const prisma = require("../../../config/prisma");
const { schedulePeracikan, deletePeracikan } = require("../../../utils/penjadwalan-util");

const deleteHandler = async (request, h) => {
    try {
        const id = parseInt(request.query.id);

        await prisma.penjadwalan.delete({
            where: {
                id
            },
        });

        deletePeracikan(id);

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