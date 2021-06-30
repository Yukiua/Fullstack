import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Performer = db.define('performer', {
    performer_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        defaultValue : 1
    },
    performer_name: {
    type: Sequelize.STRING
    },
    performer_email: {
        type: Sequelize.STRING
    },
    performer_password: {
        type: Sequelize.STRING
    },
    // performer_profile_pic: {
    //     type: Sequelize.STRING
    // }
});

export default Performer;