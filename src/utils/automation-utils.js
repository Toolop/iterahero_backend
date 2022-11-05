const pool = require('../config/db');

const getAutomation = async (id) => {
	let automation = {};

	try {
		const result = await pool.query(
			'SELECT "automation".*,"actuator".automation as "automationStatus" FROM public."automation" join public."actuator" on "automation".id_actuator = "actuator".id_actuator WHERE id_sensor=$1',
			[id]
		);

		if (result.rows[0]) {
			automation = Promise.all(
				result.rows.map(async (automation) => ({
					id_actuator: automation.id_actuator,
					id_sensor: automation.id_sensor,
                    between: automation.between,
					status_lifecycle: automation.status_lifecycle,
					created_at: automation.created_at,
					id_automation: automation.id_automation,
                    automationStatus: automation.automationStatus,
				}))
			);
		}
	} catch (err) {
		console.log(err);
	}

	return automation;
};

module.exports = {getAutomation};