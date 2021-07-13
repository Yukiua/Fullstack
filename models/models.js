import Hash   from 'hash.js';
import ORM    from 'sequelize';
const { Sequelize, Op } = ORM;

import { ModelUser }     from './user.mjs';


/**
 * Initialize all the models within the system
 * @param {ORM.Sequelize} database
 */
export function initialize_models(database) {
	try {
		console.log("Initializing ORM models");
		//	Initialize models
		ModelUser.initialize(database);

		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc
	
		console.log("Adding initialization hooks");
		//	Run once hooks during initialization
		database.addHook("afterBulkSync", generate_root_account.name,    generate_root_account.bind(this, database));
		database.addHook("afterBulkSync", generate_dummy_accounts.name,  generate_dummy_accounts.bind(this, database));
	}
	catch (error) {
		console.error ("Failed to configure ORM models");
		console.error (error);
	}
}

/**
 * This function creates a root account 
 * @param {ORM.Sequelize} database Database ORM handle
 * @param {ORM.SyncOptions} options Synchronization options, not used
 */
 async function generate_root_account(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_root_account.name);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generating root administrator account");
		const root_parameters = {	
			uuid    : "00000000-0000-0000-0000-000000000000",
			name    : "root",
			email   : "root@mail.com",
			role    : "admin",
			verified: true,
			password: Hash.sha256().update("P@ssw0rd").digest("hex")
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelUser.findOne({where: { "uuid": root_parameters.uuid }});
		
		account = await ((account) ? account.update(root_parameters): ModelUser.create(root_parameters));
		
		console.log("== Generated root account ==");
		console.log(account.toJSON());
		console.log("============================");
		return Promise.resolve();
	}
	catch (error) {
		console.error ("Failed to generate root administrator user account");
		console.error (error);
		return Promise.reject(error);
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
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generating root administrator account");

		const dummy_qty = await ModelUser.count({ where : { "name" : { [Op.startsWith]: `dummy_%`}}});
		const topup_qty = 100 - dummy_qty;
		const batch     = [];
		for (var i = 0; i < topup_qty; ++i) {
			batch.push({
				name:     `dummy_${i}`,
				email:    `dummy_${i}@mail.com`,
				password: Hash.sha256().update("P@ssw0rd").digest("hex"),
				verified: true,
			});
		}

		const users = await ModelUser.bulkCreate(batch);

		console.log(`== There are ${dummy_qty} existing dummy accounts ==`);
		console.log(`Generated ${users.length} dummy accounts`);
		console.log("====================================================");
		return Promise.resolve();
	}
	catch (error) {
		console.error ("Failed to generate dummy accounts");
		console.error (error);
		return Promise.reject(error);
	}
}
