const { PrismaClient } = require('@prisma/client');
const pool = require('../../../config/db');
const prisma = new PrismaClient();

const getCameraByGreenhouseId = async (request, h) => {
    let response;

    const { by_id_greenhouse } = request.query;
    let { page, size } = request.query;

    try {
        page = parseInt(page) || 1;
        size = parseInt(size) || 10;
        let  offset = (page - 1) * size;

        // const totalData = (await pool.query(`SELECT COUNT(*) FROM public.camera WHERE id_greenhouse = $1;`, [by_id_greenhouse])).rows[0].count;
        const totalData = await prisma.camera.count({
            where: { id_greenhouse: parseInt(by_id_greenhouse) },
        });
        
        const pagination = {
            totalPage: Math.floor(totalData / size) + 1,
            totalData: parseInt(totalData),
            currentPage: page,
            size
        }

        if (offset > pagination.totalData) {
            pagination.currentPage = pagination.totalPage;
        }
        
        // data = await pool.query(
        //     `SELECT * from public.camera WHERE id_greenhouse = $1 OFFSET $2 LIMIT $3;`, 
        //     [by_id_greenhouse, offset, size]
        // );

        let data = await prisma.camera.findMany({
            where: { id_greenhouse: parseInt(by_id_greenhouse) },
            skip: (pagination.currentPage - 1) * size,
            take: size
        });

        response = h.response({
            status: 'success',
            data,
            pagination
            }).code(200);
    } catch(e) {
        response = h.response({
            status: 'error',
            message: e
        }).code(400)
    }
    return response;
}

module.exports = {
    getCameraByGreenhouseId
}
