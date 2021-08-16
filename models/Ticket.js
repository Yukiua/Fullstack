import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

const Ticket = db.define('tickets',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: 1
    },
    userID:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    concertID:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    livestreamID:{
        type: Sequelize.CHAR(36),
        allowNull: false
    }
});

export default Ticket;