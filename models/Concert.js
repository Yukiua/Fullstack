import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

const Concert = db.define('concert',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
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
        type: Sequelize.DATE
    },
    time:{
        type: Sequelize.TIME
    },
    tickets:{
        type: Sequelize.STRING
    }
});

export default Concert;