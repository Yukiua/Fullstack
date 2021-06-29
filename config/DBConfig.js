// Bring in Sequelize
import Sequelize from 'sequelize';
// Bring in db.js which contains database name, username and password
import db from './db.js';
// Instantiates Sequelize with database parameters
const mySQLDB = new Sequelize(db.database,db.user,db.password, {
    port: db.port,
    host: db.host, // Name or IP address of MySQL server
    dialect: 'mysql', // Tells squelize that MySQL is used
    operatorsAliases: false,
    define: {
        timestamps: false // Don't create timestamp fields in database
    },

    pool: { // Database system params, don't need to know
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

export default mySQLDB;