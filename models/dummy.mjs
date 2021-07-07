import ORM    from 'sequelize';
const { Sequelize, Op } = ORM;
import Hash   from 'hash.js';
import Concert from './Concert.js';

export function initialize_models(database) {
	try {
		console.log("Initializing ORM models");
		//	Initialize models
		Concert.initialize(database);

		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc
	
		console.log("Adding initialization hooks");
		//	Run once hooks during initialization
		database.addHook("afterBulkSync", generate_dummy_accounts.name,  generate_dummy_accounts.bind(this, database));
	}
	catch (error) {
		console.error ("Failed to configure ORM models");
		console.error (error);
	}
}

/**
 * This function generates dummy accounts
 * @param {ORM.Sequelize}   database Database ORM handle
 * @param {ORM.SyncOptions} options Synchronization options, not used
 */
async function generate_dummy_accounts(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_dummy_accounts.name);
	//	Create a root concert if not exists otherwise update it
	try {
		console.log("Generating root administrator account");

		const dummy_qty = await Concert.count({ where : { "id" : { [Op.startsWith]: `dummy_%`}}});
		const topup_qty = 100 - dummy_qty;
		const batch     = [];
		for (var i = 0; i < topup_qty; ++i) {
			batch.push({
				id:     `dummy_${i}`,
				title:    `dummy_${i} Stream`,
				details: Hash.sha256().update("P@ssw0rd").digest("hex"),
				genre:    `dummy genre`,
				date:    `getTime()`,
				time:    `getTime()`,
				tickets:    `Normal`,
			});
		}

		const concerts = await Concert.bulkCreate(batch);

		console.log(`== There are ${dummy_qty} existing dummy accounts ==`);
		console.log(`Generated ${concerts.length} dummy accounts`);
		console.log("====================================================");
		return Promise.resolve();
	}
	catch (error) {
		console.error ("Failed to generate dummy accounts");
		console.error (error);
		return Promise.reject(error);
	}
}
