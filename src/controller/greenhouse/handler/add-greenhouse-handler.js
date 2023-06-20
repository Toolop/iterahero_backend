const pool = require("../../../config/db");
const { uploadImage, deleteImage } = require("../../../utils/cloudinary");
const { getLocalISOString } = require("../../../utils/timestamp-utils");
const { getUser } = require("../../../utils/user-util");
const uploadGreenHouse = async (request, h) => {
  const { name, location } = request.payload;
  const { id_user } = request.auth.credentials;

  let { image } = request.payload;

  let response = "";

  try {
    if (image) {
      const uploadImagePayload = await uploadImage("greenhouse_images", image);
      let getCount = uploadImagePayload.url.length;
      let getUrl = uploadImagePayload.url.slice(4, getCount);
      let addText = "https";
      image = addText + getUrl;
    }

    const created_at = getLocalISOString();

    const result = await pool.query(
      `INSERT INTO public."greenhouse" (name, image, location, created_at,updated_at, id_user) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`,
      [name, image, location, created_at, created_at, id_user]
    );

    if (result) {
      response = h.response({
        code: 201,
        status: "Created",
        message: "Greenhouse successfully created",
        data: {
          id: result.rows[0].id_greenhouse,
          name: result.rows[0].name,
          image: result.rows[0].image,
          location: result.rows[0].location,
          created_at: result.rows[0].created_at,
          user_id: result.rows[0].id_user,
          user_name: (await getUser(result.rows[0].id_user)).name,
        },
      });

      response.code(201);
    } else {
      if (image) {
        deleteImage(image);
      }

      response = h.response({
        code: 500,
        status: "Internal Server Error",
        message: "Greenhouse failed to create",
      });
    }
  } catch (err) {
    if (image) {
      deleteImage(image);
    }
    response = h.response({
      code: 400,
      status: "Bad Request",
      message: "error",
    });

    response.code(400);

    console.log(err);
  }

  return response;
};

module.exports = {
  uploadGreenHouse,
};
