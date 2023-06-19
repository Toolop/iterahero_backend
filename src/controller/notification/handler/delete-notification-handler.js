const pool = require("../../../config/db");
const { isNotificationExist } = require("../../../utils/notification-util");

const deleteNotification = async (request, h) => {
  const { id } = request.params;
  let result = "";
  let response = "";

  try {
    if (await isNotificationExist) {
      result = await pool.query(
        `DELETE FROM public."receive" WHERE id_notification = $1`,
        [id]
      );
      await pool.query(
        `DELETE FROM public."notification" WHERE id_notification = $1`,
        [id]
      );

      if (result) {
        response = h.response({
          code: 200,
          status: "OK",
          message: "Notification successfully deleted",
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Notification failed to delete",
        });

        response.code(500);
      }
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
  deleteNotification,
};
