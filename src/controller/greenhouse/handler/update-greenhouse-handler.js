const pool = require("../../../config/db");
const { uploadImage } = require("../../../utils/cloudinary");
const {
  isGreenhouseExist,
  deletimageGreenhouse,
} = require("../../../utils/greenhouse-util");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const updateGreenhouse = async (request, h) => {
  const { id } = request.params;
  const { name, location } = request.payload;
  let { image } = request.payload;
  let result = "";
  let response = "";

  try {
    if (await isGreenhouseExist(id)) {
      const updated_at = getLocalISOString();

      if (image) {
        deletimageGreenhouse(id);
        const uploadImageResult = await uploadImage("greenhouse_images", image);
        let getCount = uploadImageResult.url.length;
        let getUrl = uploadImageResult.url.slice(4, getCount);
        let addText = "https";
        image = addText + getUrl;

        result = await pool.query(
          'UPDATE public."greenhouse" SET name=$1, image=$2, "location"=$3, updated_at=$4 WHERE id_greenhouse=$5',
          [name, image, location, updated_at, id]
        );
      } else {
        result = await pool.query(
          'UPDATE public."greenhouse" SET name=$1, "location"=$2, updated_at=$3 WHERE id_greenhouse =$4',
          [name, location, updated_at, id]
        );
      }

      if (result) {
        response = h.response({
          code: 200,
          status: "OK",
          message: "Greenhouse has been edited successfully",
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Greenhouse cannot be edited",
        });

        response.code(500);
      }
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Greenhouse is not found",
      });

      response.code(404);
    }
  } catch (err) {
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
  updateGreenhouse,
};
