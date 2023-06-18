const prefix = require('../../utils/prefix-utils.js');
const { getCountNotifications } = require('./handler/count-notification-handler.js');
const { deleteNotification } = require('./handler/delete-notification-handler.js');
const { deleteNotificationByUser } = require('./handler/deletebyuser-notification-handler.js');
const { getNotificationDetail } = require('./handler/detail-notification-handler.js');
const { getNotifications } = require('./handler/get-notification-handler.js');
const { updateNotifications } = require('./handler/update-notification-handler.js');
const { uploadNotification } = require('./handler/upload-notification-handler.js');

module.exports = [
    {
		method: "POST",
		path: `${prefix}/notification`,
		config: {
			auth: "jwt",
		},
		handler: uploadNotification,
	},
	{
		method: "GET",
		path: `${prefix}/notification-count`,
		config: { 
			auth: "jwt",
		 },
		handler: getCountNotifications,
	},
	{
		method: "POST",
		path: `${prefix}/notification-update`,
		config: { 
			auth: "jwt",
		 },
		handler: updateNotifications,
	},
    {
		method: "GET",
		path: `${prefix}/notification`,
		config: { auth: "jwt" },
		handler: getNotifications,
	},
    {
		method: "DELETE",
		path: `${prefix}/notification/{id}`,
		config: { auth: "jwt" },
		handler: deleteNotification,
	},
	{
		method: "DELETE",
		path: `${prefix}/notification`,
		config: { auth: "jwt" },
		handler: deleteNotificationByUser,
	},
	{
		method: "GET",
		path: `${prefix}/notification/{id}`,
		config: { auth: "jwt" },
		handler: getNotificationDetail,
	},
]