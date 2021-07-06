import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Performer = db.define('performer', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: 1,
    },
    name: {
    type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    profile_pic: {
        type: Sequelize.STRING,
        allowNull:true,
        defaultValue: "default.png"
    }
});

export default Performer;