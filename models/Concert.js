import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

const Concert = db.define('concert',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: 1
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    details:{
        type: Sequelize.STRING(1000),
        allowNull: false
    },
    genre:{
        type: Sequelize.STRING,
        allowNull: false
    },
    date:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    time:{
        type: Sequelize.TIME,
        allowNull: false
    },
    bticket:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    ntp:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    btp:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

export default Concert;