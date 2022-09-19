const pool = require("../config/db");

const getUser = async (id) => {
	let user = {};

	try {
		const result = await pool.query(
			'SELECT * FROM public."user" WHERE id_user=$1',
			[id]
		);

        if (result.rows[0]) {
            const userData = result.rows[0];
            user = {
                id: userData.id_user,
                email: userData.email,
                name: userData.name,
                username: userData.username,
            };
        }
	} catch (err) {
		console.log(err);
	}

    return user;
};

module.exports = { getUser };