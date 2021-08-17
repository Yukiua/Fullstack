import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

const Ticket = db.define('tickets',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: 1
    },
    userID:{
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    concertID:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    }
});

export default Ticket;