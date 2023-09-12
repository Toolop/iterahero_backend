const pool = require('../../../config/db');

const addCameraByGreenhouseId = async (request, h) => {
    let response;

    const { by_id_greenhouse, nama_kamera } = request.payload;

    try {
        await pool.query(`INSERT INTO public.camera (id_greenhouse, name) VALUES ($1, $2);`, [by_id_greenhouse, nama_kamera]);
        response = h.response({
            status: 'success',
            message: `kamera dengan nama ${nama_kamera} berhasil ditambahkan`
        }).code(201)
    } catch(e) {
        response = h.response({
            status: 'error',
            message: e
        }).code(400)
    }
    return response;
}

module.exports = {
    addCameraByGreenhouseId
}
