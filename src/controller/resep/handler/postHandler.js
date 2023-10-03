const Boom = require("@hapi/boom")
const prisma = require("../../../config/prisma");

const postHandler = async (request, h) => {
    try {
        const { nama, ppm, ph, interval } = request.payload;

        await prisma.resep.create({
            data: {
                nama,
                ppm,
                ph,
                interval
            }
        });

        return h.response({
            status: 'success',
            message: `Resep ${nama} berhasil ditambahkan`
        }).code(201);
    }
    catch (e) {
        if (e instanceof Error) {
            return Boom.internal(e.message);
        }
    }
    prisma.$disconnect();
}

module.exports = { postHandler }