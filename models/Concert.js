import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

const Concert = db.define('concert',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: 1
    },
    title:{
        type: Sequelize.STRING
    },
    details:{
        type: Sequelize.STRING(1000)
    },
    genre:{
        type: Sequelize.STRING
    },
    date:{
        type: Sequelize.DATEONLY
    },
    time:{
        type: Sequelize.TIME
    },
    bticket:{
        type: Sequelize.BOOLEAN
    }
});

export default Concert;