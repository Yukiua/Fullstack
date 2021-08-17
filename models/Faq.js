import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Faq = db.define('faq', {
    uuid:{
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    question: {
        type: Sequelize.STRING
    },
    answer: {
        type: Sequelize.TEXT
    }
});

export default Faq;