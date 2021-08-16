import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

const Ticket = db.define('tickets',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: 1
    },
    userID:{
        type: Sequelize.INTEGER
    },
    concertID:{
        type: Sequelize.INTEGER
    },
    livestreamID:{
        type: Sequelize.CHAR(36)
    }
});

export default Ticket;